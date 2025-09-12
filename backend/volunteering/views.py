from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Count, Q, Sum, Avg
from django.utils import timezone
from datetime import timedelta
from .models import (
    VolunteeringCategory, VolunteeringActivity, VolunteeringComment,
    VolunteeringLike, VolunteeringShare, VolunteeringOpportunity,
    VolunteeringApplication, VolunteeringImpact
)
from .serializers import (
    VolunteeringCategorySerializer, VolunteeringActivitySerializer, VolunteeringActivityCreateSerializer,
    VolunteeringActivityUpdateSerializer, VolunteeringApprovalSerializer, VolunteeringCommentSerializer,
    VolunteeringLikeSerializer, VolunteeringShareSerializer, VolunteeringOpportunitySerializer,
    VolunteeringApplicationSerializer, VolunteeringImpactSerializer, VolunteeringStatsSerializer,
    VolunteeringAnalyticsSerializer
)


class VolunteeringCategoryListView(generics.ListAPIView):
    """List all volunteering categories."""
    
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = VolunteeringCategorySerializer
    queryset = VolunteeringCategory.objects.filter(is_active=True)


class VolunteeringActivityListView(generics.ListCreateAPIView):
    """List and create volunteering activities."""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return VolunteeringActivityCreateSerializer
        return VolunteeringActivitySerializer
    
    def get_queryset(self):
        user = self.request.user
        queryset = VolunteeringActivity.objects.select_related('user', 'category', 'verified_by')
        
        # Filter based on user role
        if user.is_student():
            # Students can see their own activities and public approved ones
            queryset = queryset.filter(
                Q(user=user) | Q(is_public=True, status='approved')
            )
        elif user.is_faculty():
            # Faculty can see all activities for review
            queryset = queryset.all()
        elif user.is_admin():
            # Admins can see all activities
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
        
        return queryset.order_by('-created_at')


class VolunteeringActivityDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Get, update, or delete a specific volunteering activity."""
    
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = VolunteeringActivitySerializer
    
    def get_queryset(self):
        user = self.request.user
        queryset = VolunteeringActivity.objects.select_related('user', 'category', 'verified_by')
        
        if user.is_student():
            # Students can only access their own activities
            queryset = queryset.filter(user=user)
        elif user.is_faculty() or user.is_admin():
            # Faculty and admins can access all activities
            queryset = queryset.all()
        
        return queryset
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return VolunteeringActivityUpdateSerializer
        return VolunteeringActivitySerializer


class VolunteeringApprovalView(generics.UpdateAPIView):
    """Approve or reject volunteering activities (Faculty/Admin only)."""
    
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = VolunteeringApprovalSerializer
    queryset = VolunteeringActivity.objects.filter(status='pending')
    
    def get_queryset(self):
        user = self.request.user
        if user.is_faculty() or user.is_admin():
            return VolunteeringActivity.objects.filter(status='pending')
        return VolunteeringActivity.objects.none()
    
    def update(self, request, *args, **kwargs):
        activity = self.get_object()
        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            action = serializer.validated_data['action']
            
            if action == 'approve':
                activity.approve(request.user)
                return Response({'message': 'Volunteering activity approved successfully.'}, status=status.HTTP_200_OK)
            else:
                rejection_reason = serializer.validated_data.get('rejection_reason', '')
                activity.reject(request.user, rejection_reason)
                return Response({'message': 'Volunteering activity rejected successfully.'}, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VolunteeringCommentListView(generics.ListCreateAPIView):
    """List and create comments for a volunteering activity."""
    
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = VolunteeringCommentSerializer
    
    def get_queryset(self):
        activity_id = self.kwargs['activity_id']
        user = self.request.user
        
        queryset = VolunteeringComment.objects.filter(activity_id=activity_id)
        
        # Students can only see non-internal comments
        if user.is_student():
            queryset = queryset.filter(is_internal=False)
        
        return queryset.select_related('user').order_by('-created_at')
    
    def perform_create(self, serializer):
        activity_id = self.kwargs['activity_id']
        activity = VolunteeringActivity.objects.get(id=activity_id)
        serializer.save(activity=activity)


class VolunteeringLikeView(generics.CreateAPIView):
    """Like or unlike a volunteering activity."""
    
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = VolunteeringLikeSerializer
    
    def post(self, request, *args, **kwargs):
        activity_id = kwargs['activity_id']
        user = request.user
        
        try:
            activity = VolunteeringActivity.objects.get(id=activity_id)
        except VolunteeringActivity.DoesNotExist:
            return Response({'error': 'Volunteering activity not found.'}, status=status.HTTP_404_NOT_FOUND)
        
        like, created = VolunteeringLike.objects.get_or_create(
            activity=activity,
            user=user
        )
        
        if created:
            return Response({'message': 'Volunteering activity liked.'}, status=status.HTTP_201_CREATED)
        else:
            like.delete()
            return Response({'message': 'Volunteering activity unliked.'}, status=status.HTTP_200_OK)


class VolunteeringShareView(generics.CreateAPIView):
    """Share a volunteering activity."""
    
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = VolunteeringShareSerializer
    
    def perform_create(self, serializer):
        activity_id = self.kwargs['activity_id']
        activity = VolunteeringActivity.objects.get(id=activity_id)
        serializer.save(activity=activity)


class VolunteeringOpportunityListView(generics.ListCreateAPIView):
    """List and create volunteering opportunities."""
    
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = VolunteeringOpportunitySerializer
    
    def get_queryset(self):
        queryset = VolunteeringOpportunity.objects.filter(status='active').select_related('category', 'created_by')
        
        # Apply filters
        category_filter = self.request.query_params.get('category')
        if category_filter:
            queryset = queryset.filter(category_id=category_filter)
        
        location_filter = self.request.query_params.get('location')
        if location_filter:
            queryset = queryset.filter(location__icontains=location_filter)
        
        return queryset.order_by('-created_at')


class VolunteeringOpportunityDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Get, update, or delete a specific volunteering opportunity."""
    
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = VolunteeringOpportunitySerializer
    queryset = VolunteeringOpportunity.objects.all()


class VolunteeringApplicationListView(generics.ListCreateAPIView):
    """List and create volunteering applications."""
    
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = VolunteeringApplicationSerializer
    
    def get_queryset(self):
        user = self.request.user
        queryset = VolunteeringApplication.objects.select_related('opportunity', 'user', 'reviewed_by')
        
        if user.is_student():
            # Students can see their own applications
            queryset = queryset.filter(user=user)
        elif user.is_faculty() or user.is_admin():
            # Faculty and admins can see all applications
            queryset = queryset.all()
        
        return queryset.order_by('-applied_at')


class VolunteeringApplicationDetailView(generics.RetrieveUpdateAPIView):
    """Get or update a specific volunteering application."""
    
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = VolunteeringApplicationSerializer
    
    def get_queryset(self):
        user = self.request.user
        queryset = VolunteeringApplication.objects.select_related('opportunity', 'user', 'reviewed_by')
        
        if user.is_student():
            # Students can only access their own applications
            queryset = queryset.filter(user=user)
        elif user.is_faculty() or user.is_admin():
            # Faculty and admins can access all applications
            queryset = queryset.all()
        
        return queryset


class VolunteeringImpactListView(generics.ListCreateAPIView):
    """List and create volunteering impacts."""
    
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = VolunteeringImpactSerializer
    
    def get_queryset(self):
        activity_id = self.kwargs.get('activity_id')
        if activity_id:
            return VolunteeringImpact.objects.filter(activity_id=activity_id)
        return VolunteeringImpact.objects.all()


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def volunteering_stats(request):
    """Get volunteering statistics."""
    user = request.user
    
    if user.is_student():
        # Student stats
        activities = VolunteeringActivity.objects.filter(user=user)
        stats = {
            'total_activities': activities.count(),
            'approved_activities': activities.filter(status='approved').count(),
            'pending_activities': activities.filter(status='pending').count(),
            'rejected_activities': activities.filter(status='rejected').count(),
            'total_hours': activities.filter(status='approved').aggregate(
                total=Sum('hours_volunteered')
            )['total'] or 0,
            'total_points': activities.filter(status='approved').aggregate(
                total=Sum('points')
            )['total'] or 0,
            'categories_count': activities.values('category').distinct().count(),
            'opportunities_count': VolunteeringOpportunity.objects.filter(status='active').count(),
        }
    else:
        # Admin/Faculty stats
        activities = VolunteeringActivity.objects.all()
        stats = {
            'total_activities': activities.count(),
            'approved_activities': activities.filter(status='approved').count(),
            'pending_activities': activities.filter(status='pending').count(),
            'rejected_activities': activities.filter(status='rejected').count(),
            'total_hours': activities.filter(status='approved').aggregate(
                total=Sum('hours_volunteered')
            )['total'] or 0,
            'total_points': activities.filter(status='approved').aggregate(
                total=Sum('points')
            )['total'] or 0,
            'categories_count': VolunteeringCategory.objects.filter(is_active=True).count(),
            'opportunities_count': VolunteeringOpportunity.objects.filter(status='active').count(),
        }
    
    serializer = VolunteeringStatsSerializer(stats)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def volunteering_analytics(request):
    """Get volunteering analytics (Admin/Faculty only)."""
    user = request.user
    
    if not (user.is_faculty() or user.is_admin()):
        return Response({'error': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)
    
    # Activities by category
    activities_by_category = {}
    for category in VolunteeringCategory.objects.all():
        count = VolunteeringActivity.objects.filter(category=category).count()
        activities_by_category[category.name] = count
    
    # Activities by month (last 12 months)
    activities_by_month = {}
    for i in range(12):
        month = timezone.now() - timedelta(days=30*i)
        month_key = month.strftime('%Y-%m')
        count = VolunteeringActivity.objects.filter(
            created_at__year=month.year,
            created_at__month=month.month
        ).count()
        activities_by_month[month_key] = count
    
    # Top volunteers
    top_volunteers = []
    for user_activity in VolunteeringActivity.objects.filter(status='approved').values('user').annotate(
        total_hours=Sum('hours_volunteered'),
        total_points=Sum('points')
    ).order_by('-total_hours')[:10]:
        user = User.objects.get(id=user_activity['user'])
        top_volunteers.append({
            'user_name': user.full_name,
            'total_hours': user_activity['total_hours'],
            'total_points': user_activity['total_points']
        })
    
    # Popular categories
    popular_categories = []
    for category in VolunteeringCategory.objects.annotate(
        activity_count=Count('activities')
    ).order_by('-activity_count')[:5]:
        popular_categories.append({
            'name': category.name,
            'count': category.activity_count
        })
    
    # Average hours per activity
    avg_hours = VolunteeringActivity.objects.filter(status='approved').aggregate(
        avg=Avg('hours_volunteered')
    )['avg'] or 0
    
    # Approval rate
    total_activities = VolunteeringActivity.objects.count()
    approved_activities = VolunteeringActivity.objects.filter(status='approved').count()
    approval_rate = (approved_activities / total_activities * 100) if total_activities > 0 else 0
    
    # Impact metrics
    total_impacts = VolunteeringImpact.objects.count()
    impact_metrics = {
        'total_impacts': total_impacts,
        'activities_with_impact': VolunteeringActivity.objects.filter(impacts__isnull=False).distinct().count(),
    }
    
    analytics = {
        'activities_by_category': activities_by_category,
        'activities_by_month': activities_by_month,
        'top_volunteers': top_volunteers,
        'popular_categories': popular_categories,
        'average_hours_per_activity': round(avg_hours, 2),
        'approval_rate': round(approval_rate, 2),
        'impact_metrics': impact_metrics,
    }
    
    serializer = VolunteeringAnalyticsSerializer(analytics)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def pending_volunteering_reviews(request):
    """Get pending volunteering reviews (Faculty/Admin only)."""
    user = request.user
    
    if not (user.is_faculty() or user.is_admin()):
        return Response({'error': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)
    
    pending_activities = VolunteeringActivity.objects.filter(status='pending').select_related('user', 'category')
    serializer = VolunteeringActivitySerializer(pending_activities, many=True, context={'request': request})
    return Response(serializer.data)
