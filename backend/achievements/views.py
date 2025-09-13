from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Count, Q, Avg, Sum
from django.utils import timezone
from datetime import timedelta
from .models import (
    AchievementCategory, Achievement, AchievementComment, 
    AchievementLike, AchievementShare, AchievementBadge, UserBadge
)
from .serializers import (
    AchievementCategorySerializer, AchievementSerializer, AchievementCreateSerializer,
    AchievementUpdateSerializer, AchievementApprovalSerializer, AchievementCommentSerializer,
    AchievementLikeSerializer, AchievementShareSerializer, AchievementBadgeSerializer,
    UserBadgeSerializer, AchievementStatsSerializer, AchievementAnalyticsSerializer
)


class AchievementCategoryListView(generics.ListAPIView):
    """List all achievement categories."""
    
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = AchievementCategorySerializer
    queryset = AchievementCategory.objects.filter(is_active=True)


class AchievementListView(generics.ListCreateAPIView):
    """List and create achievements."""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return AchievementCreateSerializer
        return AchievementSerializer
    
    def get_queryset(self):
        user = self.request.user
        queryset = Achievement.objects.select_related('user', 'category', 'verified_by')
        
        # Filter based on user role
        if user.is_student():
            # Students can see their own achievements and public approved ones
            queryset = queryset.filter(
                Q(user=user) | Q(is_public=True, status='approved')
            )
        elif user.is_faculty():
            # Faculty can see all achievements for review
            queryset = queryset.all()
        elif user.is_admin():
            # Admins can see all achievements
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


class AchievementDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Get, update, or delete a specific achievement."""
    
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = AchievementSerializer
    
    def get_queryset(self):
        user = self.request.user
        queryset = Achievement.objects.select_related('user', 'category', 'verified_by')
        
        if user.is_student():
            # Students can only access their own achievements
            queryset = queryset.filter(user=user)
        elif user.is_faculty() or user.is_admin():
            # Faculty and admins can access all achievements
            queryset = queryset.all()
        
        return queryset
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return AchievementUpdateSerializer
        return AchievementSerializer


class AchievementApprovalView(generics.UpdateAPIView):
    """Approve or reject achievements (Faculty/Admin only)."""
    
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = AchievementApprovalSerializer
    queryset = Achievement.objects.filter(status='pending')
    
    def get_queryset(self):
        user = self.request.user
        if user.is_faculty() or user.is_admin():
            return Achievement.objects.filter(status='pending')
        return Achievement.objects.none()
    
    def update(self, request, *args, **kwargs):
        achievement = self.get_object()
        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            action = serializer.validated_data['action']
            
            if action == 'approve':
                achievement.approve(request.user)
                return Response({'message': 'Achievement approved successfully.'}, status=status.HTTP_200_OK)
            else:
                rejection_reason = serializer.validated_data.get('rejection_reason', '')
                achievement.reject(request.user, rejection_reason)
                return Response({'message': 'Achievement rejected successfully.'}, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AchievementCommentListView(generics.ListCreateAPIView):
    """List and create comments for an achievement."""
    
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = AchievementCommentSerializer
    
    def get_queryset(self):
        achievement_id = self.kwargs['achievement_id']
        user = self.request.user
        
        queryset = AchievementComment.objects.filter(achievement_id=achievement_id)
        
        # Students can only see non-internal comments
        if user.is_student():
            queryset = queryset.filter(is_internal=False)
        
        return queryset.select_related('user').order_by('-created_at')
    
    def perform_create(self, serializer):
        achievement_id = self.kwargs['achievement_id']
        achievement = Achievement.objects.get(id=achievement_id)
        serializer.save(achievement=achievement)


class AchievementLikeView(generics.CreateAPIView):
    """Like or unlike an achievement."""
    
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = AchievementLikeSerializer
    
    def post(self, request, *args, **kwargs):
        achievement_id = kwargs['achievement_id']
        user = request.user
        
        try:
            achievement = Achievement.objects.get(id=achievement_id)
        except Achievement.DoesNotExist:
            return Response({'error': 'Achievement not found.'}, status=status.HTTP_404_NOT_FOUND)
        
        like, created = AchievementLike.objects.get_or_create(
            achievement=achievement,
            user=user
        )
        
        if created:
            return Response({'message': 'Achievement liked.'}, status=status.HTTP_201_CREATED)
        else:
            like.delete()
            return Response({'message': 'Achievement unliked.'}, status=status.HTTP_200_OK)


class AchievementShareView(generics.CreateAPIView):
    """Share an achievement."""
    
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = AchievementShareSerializer
    
    def perform_create(self, serializer):
        achievement_id = self.kwargs['achievement_id']
        achievement = Achievement.objects.get(id=achievement_id)
        serializer.save(achievement=achievement)


class AchievementBadgeListView(generics.ListAPIView):
    """List all achievement badges."""
    
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = AchievementBadgeSerializer
    queryset = AchievementBadge.objects.filter(is_active=True)


class UserBadgeListView(generics.ListAPIView):
    """List user's earned badges."""
    
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserBadgeSerializer
    
    def get_queryset(self):
        user_id = self.kwargs.get('user_id')
        if user_id and (self.request.user.is_faculty() or self.request.user.is_admin()):
            return UserBadge.objects.filter(user_id=user_id).select_related('badge')
        return UserBadge.objects.filter(user=self.request.user).select_related('badge')


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def achievement_stats(request):
    """Get achievement statistics."""
    user = request.user
    
    if user.is_student():
        # Student stats
        achievements = Achievement.objects.filter(user=user)
        this_month = timezone.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        stats = {
            'total_achievements': achievements.count(),
            'approved_achievements': achievements.filter(status='approved').count(),
            'pending_achievements': achievements.filter(status='pending').count(),
            'rejected_achievements': achievements.filter(status='rejected').count(),
            'total_points': achievements.filter(status='approved').aggregate(
                total=Sum('points')
            )['total'] or 0,
            'this_month_achievements': achievements.filter(created_at__gte=this_month).count(),
            'categories_count': achievements.values('category').distinct().count(),
            'badges_earned': UserBadge.objects.filter(user=user).count(),
        }
    else:
        # Admin/Faculty stats
        this_month = timezone.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        stats = {
            'total_achievements': Achievement.objects.count(),
            'approved_achievements': Achievement.objects.filter(status='approved').count(),
            'pending_achievements': Achievement.objects.filter(status='pending').count(),
            'rejected_achievements': Achievement.objects.filter(status='rejected').count(),
            'total_points': Achievement.objects.filter(status='approved').aggregate(
                total=Sum('points')
            )['total'] or 0,
            'this_month_achievements': Achievement.objects.filter(created_at__gte=this_month).count(),
            'categories_count': AchievementCategory.objects.filter(is_active=True).count(),
            'badges_earned': UserBadge.objects.count(),
        }
    
    serializer = AchievementStatsSerializer(stats)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def achievement_analytics(request):
    """Get achievement analytics (Admin/Faculty only)."""
    user = request.user
    
    if not (user.is_faculty() or user.is_admin()):
        return Response({'error': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)
    
    # Achievements by category
    achievements_by_category = {}
    for category in AchievementCategory.objects.all():
        count = Achievement.objects.filter(category=category).count()
        achievements_by_category[category.name] = count
    
    # Achievements by month (last 12 months)
    achievements_by_month = {}
    for i in range(12):
        month = timezone.now() - timedelta(days=30*i)
        month_key = month.strftime('%Y-%m')
        count = Achievement.objects.filter(
            created_at__year=month.year,
            created_at__month=month.month
        ).count()
        achievements_by_month[month_key] = count
    
    # Top achievers
    top_achievers = []
    for user_achievement in Achievement.objects.filter(status='approved').values('user').annotate(
        total_points=Sum('points')
    ).order_by('-total_points')[:10]:
        user = User.objects.get(id=user_achievement['user'])
        top_achievers.append({
            'user_name': user.full_name,
            'total_points': user_achievement['total_points']
        })
    
    # Popular categories
    popular_categories = []
    for category in AchievementCategory.objects.annotate(
        achievement_count=Count('achievements')
    ).order_by('-achievement_count')[:5]:
        popular_categories.append({
            'name': category.name,
            'count': category.achievement_count
        })
    
    # Average points per achievement
    avg_points = Achievement.objects.filter(status='approved').aggregate(
        avg=models.Avg('points')
    )['avg'] or 0
    
    # Approval rate
    total_achievements = Achievement.objects.count()
    approved_achievements = Achievement.objects.filter(status='approved').count()
    approval_rate = (approved_achievements / total_achievements * 100) if total_achievements > 0 else 0
    
    analytics = {
        'achievements_by_category': achievements_by_category,
        'achievements_by_month': achievements_by_month,
        'top_achievers': top_achievers,
        'popular_categories': popular_categories,
        'average_points_per_achievement': round(avg_points, 2),
        'approval_rate': round(approval_rate, 2),
    }
    
    serializer = AchievementAnalyticsSerializer(analytics)
    return Response(serializer.data)
