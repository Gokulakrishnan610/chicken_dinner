from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import (
    AchievementCategory, Achievement, AchievementComment, 
    AchievementLike, AchievementShare, AchievementBadge, UserBadge
)

User = get_user_model()


class AchievementCategorySerializer(serializers.ModelSerializer):
    """Serializer for achievement categories."""
    
    class Meta:
        model = AchievementCategory
        fields = ['id', 'name', 'description', 'icon', 'color', 'points_multiplier', 'is_active']


class AchievementSerializer(serializers.ModelSerializer):
    """Serializer for achievements."""
    
    user_name = serializers.SerializerMethodField()
    category_name = serializers.SerializerMethodField()
    verified_by_name = serializers.SerializerMethodField()
    evidence_file_url = serializers.SerializerMethodField()
    likes_count = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    
    class Meta:
        model = Achievement
        fields = [
            'id', 'user', 'user_name', 'title', 'description', 'category', 'category_name',
            'status', 'priority', 'points', 'evidence_url', 'evidence_file', 'evidence_file_url',
            'verified_by', 'verified_by_name', 'verified_at', 'rejection_reason',
            'skills_gained', 'tags', 'is_public', 'created_at', 'updated_at',
            'likes_count', 'comments_count', 'is_liked'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'verified_by', 'verified_at']
    
    def get_user_name(self, obj):
        return obj.user.full_name
    
    def get_category_name(self, obj):
        return obj.category.name
    
    def get_verified_by_name(self, obj):
        return obj.verified_by.full_name if obj.verified_by else None
    
    def get_evidence_file_url(self, obj):
        if obj.evidence_file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.evidence_file.url)
        return None
    
    def get_likes_count(self, obj):
        return obj.likes.count()
    
    def get_comments_count(self, obj):
        return obj.comments.count()
    
    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(user=request.user).exists()
        return False


class AchievementCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating achievements."""
    
    class Meta:
        model = Achievement
        fields = [
            'title', 'description', 'category', 'priority', 'evidence_url',
            'evidence_file', 'skills_gained', 'tags', 'is_public'
        ]
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class AchievementUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating achievements."""
    
    class Meta:
        model = Achievement
        fields = [
            'title', 'description', 'category', 'priority', 'evidence_url',
            'evidence_file', 'skills_gained', 'tags', 'is_public'
        ]


class AchievementApprovalSerializer(serializers.Serializer):
    """Serializer for approving/rejecting achievements."""
    
    action = serializers.ChoiceField(choices=['approve', 'reject'])
    rejection_reason = serializers.CharField(required=False, allow_blank=True)
    
    def validate(self, attrs):
        if attrs['action'] == 'reject' and not attrs.get('rejection_reason'):
            raise serializers.ValidationError("Rejection reason is required when rejecting an achievement.")
        return attrs


class AchievementCommentSerializer(serializers.ModelSerializer):
    """Serializer for achievement comments."""
    
    user_name = serializers.SerializerMethodField()
    
    class Meta:
        model = AchievementComment
        fields = ['id', 'user', 'user_name', 'comment', 'is_internal', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']
    
    def get_user_name(self, obj):
        return obj.user.full_name
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class AchievementLikeSerializer(serializers.ModelSerializer):
    """Serializer for achievement likes."""
    
    class Meta:
        model = AchievementLike
        fields = ['id', 'user', 'achievement', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class AchievementShareSerializer(serializers.ModelSerializer):
    """Serializer for achievement shares."""
    
    class Meta:
        model = AchievementShare
        fields = ['id', 'user', 'achievement', 'platform', 'shared_at']
        read_only_fields = ['id', 'user', 'shared_at']
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class AchievementBadgeSerializer(serializers.ModelSerializer):
    """Serializer for achievement badges."""
    
    class Meta:
        model = AchievementBadge
        fields = ['id', 'name', 'description', 'icon', 'color', 'criteria', 'is_active']


class UserBadgeSerializer(serializers.ModelSerializer):
    """Serializer for user badges."""
    
    badge = AchievementBadgeSerializer(read_only=True)
    user_name = serializers.SerializerMethodField()
    
    class Meta:
        model = UserBadge
        fields = ['id', 'user', 'user_name', 'badge', 'earned_at']
    
    def get_user_name(self, obj):
        return obj.user.full_name


class AchievementStatsSerializer(serializers.Serializer):
    """Serializer for achievement statistics."""
    
    total_achievements = serializers.IntegerField()
    approved_achievements = serializers.IntegerField()
    pending_achievements = serializers.IntegerField()
    rejected_achievements = serializers.IntegerField()
    total_points = serializers.IntegerField()
    categories_count = serializers.IntegerField()
    badges_earned = serializers.IntegerField()


class AchievementAnalyticsSerializer(serializers.Serializer):
    """Serializer for achievement analytics."""
    
    achievements_by_category = serializers.DictField()
    achievements_by_month = serializers.DictField()
    top_achievers = serializers.ListField()
    popular_categories = serializers.ListField()
    average_points_per_achievement = serializers.FloatField()
    approval_rate = serializers.FloatField()
