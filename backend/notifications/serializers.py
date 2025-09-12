from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import (
    NotificationType, Notification, NotificationTemplate, NotificationPreference,
    NotificationSubscription, NotificationLog, NotificationBatch
)

User = get_user_model()


class NotificationTypeSerializer(serializers.ModelSerializer):
    """Serializer for notification types."""
    
    class Meta:
        model = NotificationType
        fields = ['id', 'name', 'description', 'icon', 'color', 'is_active', 'created_at']


class NotificationSerializer(serializers.ModelSerializer):
    """Serializer for notifications."""
    
    type_name = serializers.SerializerMethodField()
    is_expired = serializers.SerializerMethodField()
    
    class Meta:
        model = Notification
        fields = [
            'id', 'user', 'type', 'type_name', 'title', 'message', 'priority',
            'is_read', 'is_archived', 'action_url', 'action_text', 'metadata',
            'expires_at', 'is_expired', 'created_at', 'read_at'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'read_at']
    
    def get_type_name(self, obj):
        return obj.type.name
    
    def get_is_expired(self, obj):
        return obj.is_expired()
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class NotificationTemplateSerializer(serializers.ModelSerializer):
    """Serializer for notification templates."""
    
    type_name = serializers.SerializerMethodField()
    
    class Meta:
        model = NotificationTemplate
        fields = [
            'id', 'name', 'type', 'type_name', 'title_template', 'message_template',
            'action_url_template', 'action_text', 'priority', 'is_active',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_type_name(self, obj):
        return obj.type.name


class NotificationPreferenceSerializer(serializers.ModelSerializer):
    """Serializer for notification preferences."""
    
    type_name = serializers.SerializerMethodField()
    
    class Meta:
        model = NotificationPreference
        fields = [
            'id', 'user', 'type', 'type_name', 'email_enabled', 'push_enabled',
            'sms_enabled', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']
    
    def get_type_name(self, obj):
        return obj.type.name
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class NotificationSubscriptionSerializer(serializers.ModelSerializer):
    """Serializer for notification subscriptions."""
    
    class Meta:
        model = NotificationSubscription
        fields = [
            'id', 'user', 'channel', 'endpoint', 'is_active', 'verified',
            'verification_token', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'verification_token', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class NotificationLogSerializer(serializers.ModelSerializer):
    """Serializer for notification logs."""
    
    notification_title = serializers.SerializerMethodField()
    subscription_channel = serializers.SerializerMethodField()
    
    class Meta:
        model = NotificationLog
        fields = [
            'id', 'notification', 'notification_title', 'subscription',
            'subscription_channel', 'status', 'error_message', 'sent_at',
            'delivered_at', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']
    
    def get_notification_title(self, obj):
        return obj.notification.title
    
    def get_subscription_channel(self, obj):
        return obj.subscription.channel


class NotificationBatchSerializer(serializers.ModelSerializer):
    """Serializer for notification batches."""
    
    template_name = serializers.SerializerMethodField()
    created_by_name = serializers.SerializerMethodField()
    
    class Meta:
        model = NotificationBatch
        fields = [
            'id', 'name', 'description', 'template', 'template_name', 'target_users',
            'status', 'total_notifications', 'sent_notifications', 'failed_notifications',
            'created_by', 'created_by_name', 'created_at', 'started_at', 'completed_at'
        ]
        read_only_fields = [
            'id', 'created_by', 'total_notifications', 'sent_notifications',
            'failed_notifications', 'created_at', 'started_at', 'completed_at'
        ]
    
    def get_template_name(self, obj):
        return obj.template.name
    
    def get_created_by_name(self, obj):
        return obj.created_by.full_name
    
    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)


class NotificationStatsSerializer(serializers.Serializer):
    """Serializer for notification statistics."""
    
    total_notifications = serializers.IntegerField()
    unread_notifications = serializers.IntegerField()
    read_notifications = serializers.IntegerField()
    archived_notifications = serializers.IntegerField()
    high_priority_notifications = serializers.IntegerField()
    expired_notifications = serializers.IntegerField()
    types_count = serializers.IntegerField()
    templates_count = serializers.IntegerField()


class NotificationAnalyticsSerializer(serializers.Serializer):
    """Serializer for notification analytics."""
    
    notifications_by_type = serializers.DictField()
    notifications_by_month = serializers.DictField()
    read_rate = serializers.FloatField()
    delivery_rate = serializers.FloatField()
    popular_types = serializers.ListField()
    user_engagement = serializers.DictField()
    channel_performance = serializers.DictField()
