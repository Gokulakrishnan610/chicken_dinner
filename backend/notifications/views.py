from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Count, Q, Avg
from django.utils import timezone
from datetime import timedelta
from .models import (
    NotificationType, Notification, NotificationTemplate, NotificationPreference,
    NotificationSubscription, NotificationLog, NotificationBatch
)
from .serializers import (
    NotificationTypeSerializer, NotificationSerializer, NotificationTemplateSerializer,
    NotificationPreferenceSerializer, NotificationSubscriptionSerializer, NotificationLogSerializer,
    NotificationBatchSerializer, NotificationStatsSerializer, NotificationAnalyticsSerializer
)


class NotificationTypeListView(generics.ListAPIView):
    """List all notification types."""
    
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = NotificationTypeSerializer
    queryset = NotificationType.objects.filter(is_active=True)


class NotificationListView(generics.ListCreateAPIView):
    """List and create notifications."""
    
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = NotificationSerializer
    
    def get_queryset(self):
        user = self.request.user
        queryset = Notification.objects.filter(user=user).select_related('type')
        
        # Apply filters
        is_read = self.request.query_params.get('is_read')
        if is_read is not None:
            queryset = queryset.filter(is_read=is_read.lower() == 'true')
        
        is_archived = self.request.query_params.get('is_archived')
        if is_archived is not None:
            queryset = queryset.filter(is_archived=is_archived.lower() == 'true')
        
        priority = self.request.query_params.get('priority')
        if priority:
            queryset = queryset.filter(priority=priority)
        
        type_filter = self.request.query_params.get('type')
        if type_filter:
            queryset = queryset.filter(type_id=type_filter)
        
        return queryset.order_by('-created_at')


class NotificationDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Get, update, or delete a specific notification."""
    
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = NotificationSerializer
    
    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user).select_related('type')
    
    def retrieve(self, request, *args, **kwargs):
        """Mark notification as read when retrieved."""
        instance = self.get_object()
        if not instance.is_read:
            instance.mark_as_read()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class NotificationTemplateListView(generics.ListCreateAPIView):
    """List and create notification templates."""
    
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = NotificationTemplateSerializer
    
    def get_queryset(self):
        user = self.request.user
        queryset = NotificationTemplate.objects.filter(is_active=True)
        
        # Students can only see basic templates
        if user.is_student():
            queryset = queryset.filter(type__name__in=['achievement', 'certificate', 'volunteering'])
        elif user.is_faculty():
            # Faculty can see most templates except admin-only ones
            queryset = queryset.exclude(type__name__in=['system_alert', 'admin_notification'])
        
        return queryset.select_related('type').order_by('name')


class NotificationPreferenceListView(generics.ListCreateAPIView):
    """List and create notification preferences."""
    
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = NotificationPreferenceSerializer
    
    def get_queryset(self):
        return NotificationPreference.objects.filter(user=self.request.user).select_related('type')


class NotificationSubscriptionListView(generics.ListCreateAPIView):
    """List and create notification subscriptions."""
    
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = NotificationSubscriptionSerializer
    
    def get_queryset(self):
        return NotificationSubscription.objects.filter(user=self.request.user)


class NotificationLogListView(generics.ListAPIView):
    """List notification logs."""
    
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = NotificationLogSerializer
    
    def get_queryset(self):
        user = self.request.user
        queryset = NotificationLog.objects.filter(notification__user=user)
        
        # Apply filters
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        channel_filter = self.request.query_params.get('channel')
        if channel_filter:
            queryset = queryset.filter(subscription__channel=channel_filter)
        
        return queryset.select_related('notification', 'subscription').order_by('-created_at')


class NotificationBatchListView(generics.ListCreateAPIView):
    """List and create notification batches."""
    
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = NotificationBatchSerializer
    
    def get_queryset(self):
        user = self.request.user
        queryset = NotificationBatch.objects.select_related('template', 'created_by')
        
        if user.is_student():
            # Students can only see their own batches
            queryset = queryset.filter(created_by=user)
        elif user.is_faculty() or user.is_admin():
            # Faculty and admins can see all batches
            queryset = queryset.all()
        
        return queryset.order_by('-created_at')


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def mark_notifications_read(request):
    """Mark multiple notifications as read."""
    notification_ids = request.data.get('notification_ids', [])
    
    if not notification_ids:
        return Response({'error': 'No notification IDs provided.'}, status=status.HTTP_400_BAD_REQUEST)
    
    notifications = Notification.objects.filter(
        id__in=notification_ids,
        user=request.user,
        is_read=False
    )
    
    updated_count = 0
    for notification in notifications:
        notification.mark_as_read()
        updated_count += 1
    
    return Response({
        'message': f'{updated_count} notifications marked as read.',
        'updated_count': updated_count
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def mark_all_notifications_read(request):
    """Mark all notifications as read for the current user."""
    notifications = Notification.objects.filter(
        user=request.user,
        is_read=False
    )
    
    updated_count = 0
    for notification in notifications:
        notification.mark_as_read()
        updated_count += 1
    
    return Response({
        'message': f'{updated_count} notifications marked as read.',
        'updated_count': updated_count
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def archive_notifications(request):
    """Archive multiple notifications."""
    notification_ids = request.data.get('notification_ids', [])
    
    if not notification_ids:
        return Response({'error': 'No notification IDs provided.'}, status=status.HTTP_400_BAD_REQUEST)
    
    notifications = Notification.objects.filter(
        id__in=notification_ids,
        user=request.user,
        is_archived=False
    )
    
    updated_count = notifications.update(is_archived=True)
    
    return Response({
        'message': f'{updated_count} notifications archived.',
        'updated_count': updated_count
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def delete_notifications(request):
    """Delete multiple notifications."""
    notification_ids = request.data.get('notification_ids', [])
    
    if not notification_ids:
        return Response({'error': 'No notification IDs provided.'}, status=status.HTTP_400_BAD_REQUEST)
    
    notifications = Notification.objects.filter(
        id__in=notification_ids,
        user=request.user
    )
    
    deleted_count = notifications.count()
    notifications.delete()
    
    return Response({
        'message': f'{deleted_count} notifications deleted.',
        'deleted_count': deleted_count
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def notification_stats(request):
    """Get notification statistics."""
    user = request.user
    
    notifications = Notification.objects.filter(user=user)
    
    stats = {
        'total_notifications': notifications.count(),
        'unread_notifications': notifications.filter(is_read=False).count(),
        'read_notifications': notifications.filter(is_read=True).count(),
        'archived_notifications': notifications.filter(is_archived=True).count(),
        'high_priority_notifications': notifications.filter(priority__in=['high', 'urgent']).count(),
        'expired_notifications': notifications.filter(expires_at__lt=timezone.now()).count(),
        'types_count': NotificationType.objects.filter(is_active=True).count(),
        'templates_count': NotificationTemplate.objects.filter(is_active=True).count(),
    }
    
    serializer = NotificationStatsSerializer(stats)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def notification_analytics(request):
    """Get notification analytics (Admin/Faculty only)."""
    user = request.user
    
    if not (user.is_faculty() or user.is_admin()):
        return Response({'error': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)
    
    # Notifications by type
    notifications_by_type = {}
    for notification_type in NotificationType.objects.all():
        count = Notification.objects.filter(type=notification_type).count()
        notifications_by_type[notification_type.name] = count
    
    # Notifications by month (last 12 months)
    notifications_by_month = {}
    for i in range(12):
        month = timezone.now() - timedelta(days=30*i)
        month_key = month.strftime('%Y-%m')
        count = Notification.objects.filter(
            created_at__year=month.year,
            created_at__month=month.month
        ).count()
        notifications_by_month[month_key] = count
    
    # Read rate
    total_notifications = Notification.objects.count()
    read_notifications = Notification.objects.filter(is_read=True).count()
    read_rate = (read_notifications / total_notifications * 100) if total_notifications > 0 else 0
    
    # Delivery rate
    total_logs = NotificationLog.objects.count()
    delivered_logs = NotificationLog.objects.filter(status='delivered').count()
    delivery_rate = (delivered_logs / total_logs * 100) if total_logs > 0 else 0
    
    # Popular types
    popular_types = []
    for notification_type in NotificationType.objects.annotate(
        notification_count=Count('notifications')
    ).order_by('-notification_count')[:5]:
        popular_types.append({
            'name': notification_type.name,
            'count': notification_type.notification_count
        })
    
    # User engagement
    user_engagement = {
        'total_users': User.objects.count(),
        'users_with_notifications': Notification.objects.values('user').distinct().count(),
        'active_users': Notification.objects.filter(
            created_at__gte=timezone.now() - timedelta(days=30)
        ).values('user').distinct().count(),
    }
    
    # Channel performance
    channel_performance = {}
    for channel, _ in NotificationSubscription.CHANNEL_CHOICES:
        total_logs = NotificationLog.objects.filter(subscription__channel=channel).count()
        delivered_logs = NotificationLog.objects.filter(
            subscription__channel=channel,
            status='delivered'
        ).count()
        success_rate = (delivered_logs / total_logs * 100) if total_logs > 0 else 0
        channel_performance[channel] = {
            'total': total_logs,
            'delivered': delivered_logs,
            'success_rate': round(success_rate, 2)
        }
    
    analytics = {
        'notifications_by_type': notifications_by_type,
        'notifications_by_month': notifications_by_month,
        'read_rate': round(read_rate, 2),
        'delivery_rate': round(delivery_rate, 2),
        'popular_types': popular_types,
        'user_engagement': user_engagement,
        'channel_performance': channel_performance,
    }
    
    serializer = NotificationAnalyticsSerializer(analytics)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def send_notification(request):
    """Send a notification to a user (Admin/Faculty only)."""
    user = request.user
    
    if not (user.is_faculty() or user.is_admin()):
        return Response({'error': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)
    
    target_user_id = request.data.get('target_user_id')
    notification_type_id = request.data.get('notification_type_id')
    title = request.data.get('title')
    message = request.data.get('message')
    priority = request.data.get('priority', 'medium')
    action_url = request.data.get('action_url', '')
    action_text = request.data.get('action_text', '')
    
    if not all([target_user_id, notification_type_id, title, message]):
        return Response({'error': 'Missing required fields.'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        target_user = User.objects.get(id=target_user_id)
        notification_type = NotificationType.objects.get(id=notification_type_id)
    except (User.DoesNotExist, NotificationType.DoesNotExist):
        return Response({'error': 'Invalid user or notification type.'}, status=status.HTTP_400_BAD_REQUEST)
    
    notification = Notification.objects.create(
        user=target_user,
        type=notification_type,
        title=title,
        message=message,
        priority=priority,
        action_url=action_url,
        action_text=action_text
    )
    
    serializer = NotificationSerializer(notification, context={'request': request})
    return Response(serializer.data, status=status.HTTP_201_CREATED)
