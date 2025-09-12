from django.db import models
from django.conf import settings
from django.utils import timezone


class NotificationType(models.Model):
    """Types of notifications."""
    
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField()
    icon = models.CharField(max_length=50, blank=True)
    color = models.CharField(max_length=7, default='#3B82F6')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'notification_types'
        verbose_name = 'Notification Type'
        verbose_name_plural = 'Notification Types'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class Notification(models.Model):
    """User notifications."""
    
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
    type = models.ForeignKey(NotificationType, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=200)
    message = models.TextField()
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    is_read = models.BooleanField(default=False)
    is_archived = models.BooleanField(default=False)
    action_url = models.URLField(blank=True)
    action_text = models.CharField(max_length=100, blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    read_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'notifications'
        verbose_name = 'Notification'
        verbose_name_plural = 'Notifications'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.full_name} - {self.title}"
    
    def mark_as_read(self):
        """Mark notification as read."""
        if not self.is_read:
            self.is_read = True
            self.read_at = timezone.now()
            self.save()
    
    def is_expired(self):
        """Check if notification is expired."""
        if self.expires_at:
            return timezone.now() > self.expires_at
        return False


class NotificationTemplate(models.Model):
    """Templates for generating notifications."""
    
    name = models.CharField(max_length=100, unique=True)
    type = models.ForeignKey(NotificationType, on_delete=models.CASCADE, related_name='templates')
    title_template = models.CharField(max_length=200)
    message_template = models.TextField()
    action_url_template = models.URLField(blank=True)
    action_text = models.CharField(max_length=100, blank=True)
    priority = models.CharField(max_length=10, choices=Notification.PRIORITY_CHOICES, default='medium')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'notification_templates'
        verbose_name = 'Notification Template'
        verbose_name_plural = 'Notification Templates'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class NotificationPreference(models.Model):
    """User notification preferences."""
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notification_preferences')
    type = models.ForeignKey(NotificationType, on_delete=models.CASCADE, related_name='preferences')
    email_enabled = models.BooleanField(default=True)
    push_enabled = models.BooleanField(default=True)
    sms_enabled = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'notification_preferences'
        verbose_name = 'Notification Preference'
        verbose_name_plural = 'Notification Preferences'
        unique_together = ['user', 'type']
    
    def __str__(self):
        return f"{self.user.full_name} - {self.type.name}"


class NotificationSubscription(models.Model):
    """User subscriptions to notification channels."""
    
    CHANNEL_CHOICES = [
        ('email', 'Email'),
        ('push', 'Push Notification'),
        ('sms', 'SMS'),
        ('webhook', 'Webhook'),
    ]
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notification_subscriptions')
    channel = models.CharField(max_length=20, choices=CHANNEL_CHOICES)
    endpoint = models.CharField(max_length=500)  # Email address, device token, webhook URL, etc.
    is_active = models.BooleanField(default=True)
    verified = models.BooleanField(default=False)
    verification_token = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'notification_subscriptions'
        verbose_name = 'Notification Subscription'
        verbose_name_plural = 'Notification Subscriptions'
        unique_together = ['user', 'channel', 'endpoint']
    
    def __str__(self):
        return f"{self.user.full_name} - {self.channel}"


class NotificationLog(models.Model):
    """Log of notification delivery attempts."""
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('sent', 'Sent'),
        ('delivered', 'Delivered'),
        ('failed', 'Failed'),
        ('bounced', 'Bounced'),
    ]
    
    notification = models.ForeignKey(Notification, on_delete=models.CASCADE, related_name='logs')
    subscription = models.ForeignKey(NotificationSubscription, on_delete=models.CASCADE, related_name='logs')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    error_message = models.TextField(blank=True)
    sent_at = models.DateTimeField(null=True, blank=True)
    delivered_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'notification_logs'
        verbose_name = 'Notification Log'
        verbose_name_plural = 'Notification Logs'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.notification.title} - {self.subscription.channel} - {self.status}"


class NotificationBatch(models.Model):
    """Batch notifications for bulk operations."""
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]
    
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    template = models.ForeignKey(NotificationTemplate, on_delete=models.CASCADE, related_name='batches')
    target_users = models.JSONField(default=list)  # List of user IDs or criteria
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    total_notifications = models.PositiveIntegerField(default=0)
    sent_notifications = models.PositiveIntegerField(default=0)
    failed_notifications = models.PositiveIntegerField(default=0)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='created_batches')
    created_at = models.DateTimeField(auto_now_add=True)
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'notification_batches'
        verbose_name = 'Notification Batch'
        verbose_name_plural = 'Notification Batches'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} - {self.status}"
