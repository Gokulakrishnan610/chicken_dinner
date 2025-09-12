from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import (
    VolunteeringCategory, VolunteeringActivity, VolunteeringComment,
    VolunteeringLike, VolunteeringShare, VolunteeringOpportunity,
    VolunteeringApplication, VolunteeringImpact
)

User = get_user_model()


class VolunteeringCategorySerializer(serializers.ModelSerializer):
    """Serializer for volunteering categories."""
    
    class Meta:
        model = VolunteeringCategory
        fields = ['id', 'name', 'description', 'icon', 'color', 'points_per_hour', 'is_active']


class VolunteeringActivitySerializer(serializers.ModelSerializer):
    """Serializer for volunteering activities."""
    
    user_name = serializers.SerializerMethodField()
    category_name = serializers.SerializerMethodField()
    verified_by_name = serializers.SerializerMethodField()
    evidence_file_url = serializers.SerializerMethodField()
    likes_count = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    
    class Meta:
        model = VolunteeringActivity
        fields = [
            'id', 'user', 'user_name', 'title', 'description', 'organization', 'location',
            'category', 'category_name', 'activity_date', 'hours_volunteered', 'status',
            'priority', 'points', 'evidence_url', 'evidence_file', 'evidence_file_url',
            'verified_by', 'verified_by_name', 'verified_at', 'rejection_reason',
            'skills_developed', 'tags', 'is_public', 'created_at', 'updated_at',
            'likes_count', 'comments_count', 'is_liked'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'verified_by', 'verified_at', 'points']
    
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


class VolunteeringActivityCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating volunteering activities."""
    
    class Meta:
        model = VolunteeringActivity
        fields = [
            'title', 'description', 'organization', 'location', 'category',
            'activity_date', 'hours_volunteered', 'priority', 'evidence_url',
            'evidence_file', 'skills_developed', 'tags', 'is_public'
        ]
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class VolunteeringActivityUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating volunteering activities."""
    
    class Meta:
        model = VolunteeringActivity
        fields = [
            'title', 'description', 'organization', 'location', 'category',
            'activity_date', 'hours_volunteered', 'priority', 'evidence_url',
            'evidence_file', 'skills_developed', 'tags', 'is_public'
        ]


class VolunteeringApprovalSerializer(serializers.Serializer):
    """Serializer for approving/rejecting volunteering activities."""
    
    action = serializers.ChoiceField(choices=['approve', 'reject'])
    rejection_reason = serializers.CharField(required=False, allow_blank=True)
    
    def validate(self, attrs):
        if attrs['action'] == 'reject' and not attrs.get('rejection_reason'):
            raise serializers.ValidationError("Rejection reason is required when rejecting a volunteering activity.")
        return attrs


class VolunteeringCommentSerializer(serializers.ModelSerializer):
    """Serializer for volunteering comments."""
    
    user_name = serializers.SerializerMethodField()
    
    class Meta:
        model = VolunteeringComment
        fields = ['id', 'user', 'user_name', 'comment', 'is_internal', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']
    
    def get_user_name(self, obj):
        return obj.user.full_name
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class VolunteeringLikeSerializer(serializers.ModelSerializer):
    """Serializer for volunteering likes."""
    
    class Meta:
        model = VolunteeringLike
        fields = ['id', 'user', 'activity', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class VolunteeringShareSerializer(serializers.ModelSerializer):
    """Serializer for volunteering shares."""
    
    class Meta:
        model = VolunteeringShare
        fields = ['id', 'user', 'activity', 'platform', 'shared_at']
        read_only_fields = ['id', 'user', 'shared_at']
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class VolunteeringOpportunitySerializer(serializers.ModelSerializer):
    """Serializer for volunteering opportunities."""
    
    created_by_name = serializers.SerializerMethodField()
    category_name = serializers.SerializerMethodField()
    applications_count = serializers.SerializerMethodField()
    
    class Meta:
        model = VolunteeringOpportunity
        fields = [
            'id', 'title', 'description', 'organization', 'location', 'category', 'category_name',
            'start_date', 'end_date', 'required_hours', 'max_volunteers', 'contact_email',
            'contact_phone', 'requirements', 'benefits', 'status', 'is_featured',
            'created_by', 'created_by_name', 'created_at', 'updated_at', 'applications_count'
        ]
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']
    
    def get_created_by_name(self, obj):
        return obj.created_by.full_name
    
    def get_category_name(self, obj):
        return obj.category.name
    
    def get_applications_count(self, obj):
        return obj.applications.count()
    
    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)


class VolunteeringApplicationSerializer(serializers.ModelSerializer):
    """Serializer for volunteering applications."""
    
    user_name = serializers.SerializerMethodField()
    opportunity_title = serializers.SerializerMethodField()
    reviewed_by_name = serializers.SerializerMethodField()
    
    class Meta:
        model = VolunteeringApplication
        fields = [
            'id', 'opportunity', 'opportunity_title', 'user', 'user_name', 'motivation',
            'relevant_experience', 'available_hours', 'status', 'applied_at',
            'reviewed_at', 'reviewed_by', 'reviewed_by_name', 'review_notes'
        ]
        read_only_fields = ['id', 'user', 'applied_at', 'reviewed_at', 'reviewed_by']
    
    def get_user_name(self, obj):
        return obj.user.full_name
    
    def get_opportunity_title(self, obj):
        return obj.opportunity.title
    
    def get_reviewed_by_name(self, obj):
        return obj.reviewed_by.full_name if obj.reviewed_by else None
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class VolunteeringImpactSerializer(serializers.ModelSerializer):
    """Serializer for volunteering impacts."""
    
    class Meta:
        model = VolunteeringImpact
        fields = ['id', 'activity', 'metric_name', 'metric_value', 'metric_unit', 'description', 'created_at']
        read_only_fields = ['id', 'created_at']


class VolunteeringStatsSerializer(serializers.Serializer):
    """Serializer for volunteering statistics."""
    
    total_activities = serializers.IntegerField()
    approved_activities = serializers.IntegerField()
    pending_activities = serializers.IntegerField()
    rejected_activities = serializers.IntegerField()
    total_hours = serializers.FloatField()
    total_points = serializers.IntegerField()
    categories_count = serializers.IntegerField()
    opportunities_count = serializers.IntegerField()


class VolunteeringAnalyticsSerializer(serializers.Serializer):
    """Serializer for volunteering analytics."""
    
    activities_by_category = serializers.DictField()
    activities_by_month = serializers.DictField()
    top_volunteers = serializers.ListField()
    popular_categories = serializers.ListField()
    average_hours_per_activity = serializers.FloatField()
    approval_rate = serializers.FloatField()
    impact_metrics = serializers.DictField()
