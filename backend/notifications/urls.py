from django.urls import path
from . import views

urlpatterns = [
    # Types
    path('types/', views.NotificationTypeListView.as_view(), name='notification-type-list'),
    
    # Notifications
    path('', views.NotificationListView.as_view(), name='notification-list'),
    path('<int:pk>/', views.NotificationDetailView.as_view(), name='notification-detail'),
    path('mark-read/', views.mark_notifications_read, name='mark-notifications-read'),
    path('mark-all-read/', views.mark_all_notifications_read, name='mark-all-notifications-read'),
    path('archive/', views.archive_notifications, name='archive-notifications'),
    path('delete/', views.delete_notifications, name='delete-notifications'),
    
    # Templates
    path('templates/', views.NotificationTemplateListView.as_view(), name='notification-template-list'),
    
    # Preferences
    path('preferences/', views.NotificationPreferenceListView.as_view(), name='notification-preference-list'),
    
    # Subscriptions
    path('subscriptions/', views.NotificationSubscriptionListView.as_view(), name='notification-subscription-list'),
    
    # Logs
    path('logs/', views.NotificationLogListView.as_view(), name='notification-log-list'),
    
    # Batches
    path('batches/', views.NotificationBatchListView.as_view(), name='notification-batch-list'),
    
    # Statistics and Analytics
    path('stats/', views.notification_stats, name='notification-stats'),
    path('analytics/', views.notification_analytics, name='notification-analytics'),
    
    # Send notification
    path('send/', views.send_notification, name='send-notification'),
]
