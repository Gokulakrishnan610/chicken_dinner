from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import (
    CertificateCategory, Certificate, CertificateReview, CertificateComment,
    CertificateLike, CertificateShare, CertificateTemplate, CertificateVerification
)

User = get_user_model()


class CertificateCategorySerializer(serializers.ModelSerializer):
    """Serializer for certificate categories."""
    
    class Meta:
        model = CertificateCategory
        fields = ['id', 'name', 'description', 'icon', 'color', 'points_value', 'is_active']


class CertificateSerializer(serializers.ModelSerializer):
    """Serializer for certificates."""
    
    user_name = serializers.SerializerMethodField()
    category_name = serializers.SerializerMethodField()
    verified_by_name = serializers.SerializerMethodField()
    certificate_file_url = serializers.SerializerMethodField()
    likes_count = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    days_until_expiry = serializers.SerializerMethodField()
    
    class Meta:
        model = Certificate
        fields = [
            'id', 'user', 'user_name', 'title', 'description', 'category', 'category_name',
            'issuer', 'issue_date', 'expiry_date', 'certificate_number', 'status', 'priority',
            'points', 'certificate_file', 'certificate_file_url', 'verified_by', 'verified_by_name',
            'verified_at', 'rejection_reason', 'skills_verified', 'tags', 'is_public',
            'is_expired', 'created_at', 'updated_at', 'likes_count', 'comments_count',
            'is_liked', 'days_until_expiry'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'verified_by', 'verified_at', 'is_expired']
    
    def get_user_name(self, obj):
        return obj.user.full_name
    
    def get_category_name(self, obj):
        return obj.category.name
    
    def get_verified_by_name(self, obj):
        return obj.verified_by.full_name if obj.verified_by else None
    
    def get_certificate_file_url(self, obj):
        if obj.certificate_file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.certificate_file.url)
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
    
    def get_days_until_expiry(self, obj):
        if obj.expiry_date:
            from django.utils import timezone
            today = timezone.now().date()
            delta = obj.expiry_date - today
            return delta.days
        return None


class CertificateCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating certificates."""
    
    class Meta:
        model = Certificate
        fields = [
            'title', 'description', 'category', 'issuer', 'issue_date', 'expiry_date',
            'certificate_number', 'priority', 'points', 'certificate_file', 'skills_verified', 'tags', 'is_public'
        ]
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class CertificateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating certificates."""
    
    class Meta:
        model = Certificate
        fields = [
            'title', 'description', 'category', 'issuer', 'issue_date', 'expiry_date',
            'certificate_number', 'priority', 'certificate_file', 'skills_verified', 'tags', 'is_public'
        ]


class CertificateApprovalSerializer(serializers.Serializer):
    """Serializer for approving/rejecting certificates."""
    
    action = serializers.ChoiceField(choices=['approve', 'reject'])
    rejection_reason = serializers.CharField(required=False, allow_blank=True)
    review_notes = serializers.CharField(required=False, allow_blank=True)
    
    def validate(self, attrs):
        if attrs['action'] == 'reject' and not attrs.get('rejection_reason'):
            raise serializers.ValidationError("Rejection reason is required when rejecting a certificate.")
        return attrs


class CertificateReviewSerializer(serializers.ModelSerializer):
    """Serializer for certificate reviews."""
    
    reviewer_name = serializers.SerializerMethodField()
    
    class Meta:
        model = CertificateReview
        fields = ['id', 'certificate', 'reviewer', 'reviewer_name', 'review_notes', 'is_approved', 'reviewed_at']
        read_only_fields = ['id', 'reviewer', 'reviewed_at']
    
    def get_reviewer_name(self, obj):
        return obj.reviewer.full_name
    
    def create(self, validated_data):
        validated_data['reviewer'] = self.context['request'].user
        return super().create(validated_data)


class CertificateCommentSerializer(serializers.ModelSerializer):
    """Serializer for certificate comments."""
    
    user_name = serializers.SerializerMethodField()
    
    class Meta:
        model = CertificateComment
        fields = ['id', 'user', 'user_name', 'comment', 'is_internal', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']
    
    def get_user_name(self, obj):
        return obj.user.full_name
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class CertificateLikeSerializer(serializers.ModelSerializer):
    """Serializer for certificate likes."""
    
    class Meta:
        model = CertificateLike
        fields = ['id', 'user', 'certificate', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class CertificateShareSerializer(serializers.ModelSerializer):
    """Serializer for certificate shares."""
    
    class Meta:
        model = CertificateShare
        fields = ['id', 'user', 'certificate', 'platform', 'shared_at']
        read_only_fields = ['id', 'user', 'shared_at']
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class CertificateTemplateSerializer(serializers.ModelSerializer):
    """Serializer for certificate templates."""
    
    template_file_url = serializers.SerializerMethodField()
    
    class Meta:
        model = CertificateTemplate
        fields = ['id', 'name', 'description', 'template_file', 'template_file_url', 'is_active', 'created_at']
    
    def get_template_file_url(self, obj):
        if obj.template_file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.template_file.url)
        return None


class CertificateVerificationSerializer(serializers.ModelSerializer):
    """Serializer for certificate verification."""
    
    class Meta:
        model = CertificateVerification
        fields = ['id', 'certificate', 'verifier_email', 'verification_code', 'is_verified', 'verified_at', 'created_at']
        read_only_fields = ['id', 'verification_code', 'is_verified', 'verified_at', 'created_at']


class CertificateStatsSerializer(serializers.Serializer):
    """Serializer for certificate statistics."""
    
    total_certificates = serializers.IntegerField()
    approved_certificates = serializers.IntegerField()
    pending_certificates = serializers.IntegerField()
    rejected_certificates = serializers.IntegerField()
    expired_certificates = serializers.IntegerField()
    expiring_soon = serializers.IntegerField()
    total_points = serializers.IntegerField()
    categories_count = serializers.IntegerField()


class CertificateAnalyticsSerializer(serializers.Serializer):
    """Serializer for certificate analytics."""
    
    certificates_by_category = serializers.DictField()
    certificates_by_month = serializers.DictField()
    top_issuers = serializers.ListField()
    popular_categories = serializers.ListField()
    average_points_per_certificate = serializers.FloatField()
    approval_rate = serializers.FloatField()
    expiry_analytics = serializers.DictField()
