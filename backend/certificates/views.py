from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Count, Q, Sum, Avg
from django.utils import timezone
from datetime import timedelta, date
from .models import (
    CertificateCategory, Certificate, CertificateReview, CertificateComment,
    CertificateLike, CertificateShare, CertificateTemplate, CertificateVerification
)
from .serializers import (
    CertificateCategorySerializer, CertificateSerializer, CertificateCreateSerializer,
    CertificateUpdateSerializer, CertificateApprovalSerializer, CertificateReviewSerializer,
    CertificateCommentSerializer, CertificateLikeSerializer, CertificateShareSerializer,
    CertificateTemplateSerializer, CertificateVerificationSerializer, CertificateStatsSerializer,
    CertificateAnalyticsSerializer
)


class CertificateCategoryListView(generics.ListAPIView):
    """List all certificate categories."""
    
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CertificateCategorySerializer
    queryset = CertificateCategory.objects.filter(is_active=True)


class CertificateListView(generics.ListCreateAPIView):
    """List and create certificates."""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CertificateCreateSerializer
        return CertificateSerializer
    
    def get_queryset(self):
        user = self.request.user
        queryset = Certificate.objects.select_related('user', 'category', 'verified_by')
        
        # Filter based on user role
        if user.is_student():
            # Students can see their own certificates and public approved ones
            queryset = queryset.filter(
                Q(user=user) | Q(is_public=True, status='approved')
            )
        elif user.is_faculty():
            # Faculty can see all certificates for review
            queryset = queryset.all()
        elif user.is_admin():
            # Admins can see all certificates
            queryset = queryset.all()
        
        # Apply filters
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        category_filter = self.request.query_params.get('category')
        if category_filter:
            queryset = queryset.filter(category_id=category_filter)
        
        user_filter = self.request.query_params.get('user')
        if user_filter and (user.is_faculty() or user.is_admin()):
            queryset = queryset.filter(user_id=user_filter)
        
        expired_filter = self.request.query_params.get('expired')
        if expired_filter == 'true':
            queryset = queryset.filter(is_expired=True)
        elif expired_filter == 'false':
            queryset = queryset.filter(is_expired=False)
        
        expiring_soon = self.request.query_params.get('expiring_soon')
        if expiring_soon == 'true':
            thirty_days_from_now = date.today() + timedelta(days=30)
            queryset = queryset.filter(
                expiry_date__lte=thirty_days_from_now,
                expiry_date__gte=date.today(),
                is_expired=False
            )
        
        return queryset.order_by('-created_at')


class CertificateDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Get, update, or delete a specific certificate."""
    
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CertificateSerializer
    
    def get_queryset(self):
        user = self.request.user
        queryset = Certificate.objects.select_related('user', 'category', 'verified_by')
        
        if user.is_student():
            # Students can only access their own certificates
            queryset = queryset.filter(user=user)
        elif user.is_faculty() or user.is_admin():
            # Faculty and admins can access all certificates
            queryset = queryset.all()
        
        return queryset
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return CertificateUpdateSerializer
        return CertificateSerializer


class CertificateApprovalView(generics.UpdateAPIView):
    """Approve or reject certificates (Faculty/Admin only)."""
    
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CertificateApprovalSerializer
    queryset = Certificate.objects.filter(status='pending')
    
    def get_queryset(self):
        user = self.request.user
        if user.is_faculty() or user.is_admin():
            return Certificate.objects.filter(status='pending')
        return Certificate.objects.none()
    
    def update(self, request, *args, **kwargs):
        certificate = self.get_object()
        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            action = serializer.validated_data['action']
            review_notes = serializer.validated_data.get('review_notes', '')
            
            if action == 'approve':
                certificate.approve(request.user)
                
                # Create review record
                CertificateReview.objects.create(
                    certificate=certificate,
                    reviewer=request.user,
                    review_notes=review_notes,
                    is_approved=True
                )
                
                return Response({'message': 'Certificate approved successfully.'}, status=status.HTTP_200_OK)
            else:
                rejection_reason = serializer.validated_data.get('rejection_reason', '')
                certificate.reject(request.user, rejection_reason)
                
                # Create review record
                CertificateReview.objects.create(
                    certificate=certificate,
                    reviewer=request.user,
                    review_notes=review_notes,
                    is_approved=False
                )
                
                return Response({'message': 'Certificate rejected successfully.'}, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CertificateReviewListView(generics.ListAPIView):
    """List certificate reviews."""
    
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CertificateReviewSerializer
    
    def get_queryset(self):
        certificate_id = self.kwargs.get('certificate_id')
        if certificate_id:
            return CertificateReview.objects.filter(certificate_id=certificate_id).select_related('reviewer')
        return CertificateReview.objects.all().select_related('reviewer')


class CertificateCommentListView(generics.ListCreateAPIView):
    """List and create comments for a certificate."""
    
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CertificateCommentSerializer
    
    def get_queryset(self):
        certificate_id = self.kwargs['certificate_id']
        user = self.request.user
        
        queryset = CertificateComment.objects.filter(certificate_id=certificate_id)
        
        # Students can only see non-internal comments
        if user.is_student():
            queryset = queryset.filter(is_internal=False)
        
        return queryset.select_related('user').order_by('-created_at')
    
    def perform_create(self, serializer):
        certificate_id = self.kwargs['certificate_id']
        certificate = Certificate.objects.get(id=certificate_id)
        serializer.save(certificate=certificate)


class CertificateLikeView(generics.CreateAPIView):
    """Like or unlike a certificate."""
    
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CertificateLikeSerializer
    
    def post(self, request, *args, **kwargs):
        certificate_id = kwargs['certificate_id']
        user = request.user
        
        try:
            certificate = Certificate.objects.get(id=certificate_id)
        except Certificate.DoesNotExist:
            return Response({'error': 'Certificate not found.'}, status=status.HTTP_404_NOT_FOUND)
        
        like, created = CertificateLike.objects.get_or_create(
            certificate=certificate,
            user=user
        )
        
        if created:
            return Response({'message': 'Certificate liked.'}, status=status.HTTP_201_CREATED)
        else:
            like.delete()
            return Response({'message': 'Certificate unliked.'}, status=status.HTTP_200_OK)


class CertificateShareView(generics.CreateAPIView):
    """Share a certificate."""
    
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CertificateShareSerializer
    
    def perform_create(self, serializer):
        certificate_id = self.kwargs['certificate_id']
        certificate = Certificate.objects.get(id=certificate_id)
        serializer.save(certificate=certificate)


class CertificateTemplateListView(generics.ListAPIView):
    """List certificate templates."""
    
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CertificateTemplateSerializer
    queryset = CertificateTemplate.objects.filter(is_active=True)


class CertificateVerificationView(generics.CreateAPIView):
    """Create certificate verification request."""
    
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CertificateVerificationSerializer
    
    def perform_create(self, serializer):
        certificate_id = self.kwargs['certificate_id']
        certificate = Certificate.objects.get(id=certificate_id)
        serializer.save(certificate=certificate)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def certificate_stats(request):
    """Get certificate statistics."""
    user = request.user
    
    if user.is_student():
        # Student stats
        certificates = Certificate.objects.filter(user=user)
        expiring_soon = certificates.filter(
            expiry_date__lte=date.today() + timedelta(days=30),
            expiry_date__gte=date.today(),
            is_expired=False
        ).count()
        
        stats = {
            'total_certificates': certificates.count(),
            'approved_certificates': certificates.filter(status='approved').count(),
            'pending_certificates': certificates.filter(status='pending').count(),
            'rejected_certificates': certificates.filter(status='rejected').count(),
            'expired_certificates': certificates.filter(is_expired=True).count(),
            'expiring_soon': expiring_soon,
            'total_points': certificates.filter(status='approved').aggregate(
                total=Sum('points')
            )['total'] or 0,
            'categories_count': certificates.values('category').distinct().count(),
        }
    else:
        # Admin/Faculty stats
        certificates = Certificate.objects.all()
        expiring_soon = certificates.filter(
            expiry_date__lte=date.today() + timedelta(days=30),
            expiry_date__gte=date.today(),
            is_expired=False
        ).count()
        
        stats = {
            'total_certificates': certificates.count(),
            'approved_certificates': certificates.filter(status='approved').count(),
            'pending_certificates': certificates.filter(status='pending').count(),
            'rejected_certificates': certificates.filter(status='rejected').count(),
            'expired_certificates': certificates.filter(is_expired=True).count(),
            'expiring_soon': expiring_soon,
            'total_points': certificates.filter(status='approved').aggregate(
                total=Sum('points')
            )['total'] or 0,
            'categories_count': CertificateCategory.objects.filter(is_active=True).count(),
        }
    
    serializer = CertificateStatsSerializer(stats)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def certificate_analytics(request):
    """Get certificate analytics (Admin/Faculty only)."""
    user = request.user
    
    if not (user.is_faculty() or user.is_admin()):
        return Response({'error': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)
    
    # Certificates by category
    certificates_by_category = {}
    for category in CertificateCategory.objects.all():
        count = Certificate.objects.filter(category=category).count()
        certificates_by_category[category.name] = count
    
    # Certificates by month (last 12 months)
    certificates_by_month = {}
    for i in range(12):
        month = timezone.now() - timedelta(days=30*i)
        month_key = month.strftime('%Y-%m')
        count = Certificate.objects.filter(
            created_at__year=month.year,
            created_at__month=month.month
        ).count()
        certificates_by_month[month_key] = count
    
    # Top issuers
    top_issuers = []
    for issuer_data in Certificate.objects.values('issuer').annotate(
        count=Count('id')
    ).order_by('-count')[:10]:
        top_issuers.append({
            'issuer': issuer_data['issuer'],
            'count': issuer_data['count']
        })
    
    # Popular categories
    popular_categories = []
    for category in CertificateCategory.objects.annotate(
        certificate_count=Count('certificates')
    ).order_by('-certificate_count')[:5]:
        popular_categories.append({
            'name': category.name,
            'count': category.certificate_count
        })
    
    # Average points per certificate
    avg_points = Certificate.objects.filter(status='approved').aggregate(
        avg=Avg('points')
    )['avg'] or 0
    
    # Approval rate
    total_certificates = Certificate.objects.count()
    approved_certificates = Certificate.objects.filter(status='approved').count()
    approval_rate = (approved_certificates / total_certificates * 100) if total_certificates > 0 else 0
    
    # Expiry analytics
    total_certificates_with_expiry = Certificate.objects.exclude(expiry_date__isnull=True).count()
    expired_certificates = Certificate.objects.filter(is_expired=True).count()
    expiring_soon = Certificate.objects.filter(
        expiry_date__lte=date.today() + timedelta(days=30),
        expiry_date__gte=date.today(),
        is_expired=False
    ).count()
    
    expiry_analytics = {
        'total_with_expiry': total_certificates_with_expiry,
        'expired': expired_certificates,
        'expiring_soon': expiring_soon,
        'expiry_rate': (expired_certificates / total_certificates_with_expiry * 100) if total_certificates_with_expiry > 0 else 0
    }
    
    analytics = {
        'certificates_by_category': certificates_by_category,
        'certificates_by_month': certificates_by_month,
        'top_issuers': top_issuers,
        'popular_categories': popular_categories,
        'average_points_per_certificate': round(avg_points, 2),
        'approval_rate': round(approval_rate, 2),
        'expiry_analytics': expiry_analytics,
    }
    
    serializer = CertificateAnalyticsSerializer(analytics)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def pending_reviews(request):
    """Get pending certificate reviews (Faculty/Admin only)."""
    user = request.user
    
    if not (user.is_faculty() or user.is_admin()):
        return Response({'error': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)
    
    pending_certificates = Certificate.objects.filter(status='pending').select_related('user', 'category')
    serializer = CertificateSerializer(pending_certificates, many=True, context={'request': request})
    return Response(serializer.data)
