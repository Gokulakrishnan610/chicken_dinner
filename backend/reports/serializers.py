from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import ReportTemplate, Report, ReportSchedule, ReportAccess, ReportAnalytics

User = get_user_model()


class ReportTemplateSerializer(serializers.ModelSerializer):
    """Serializer for report templates."""
    
    created_by_name = serializers.SerializerMethodField()
    template_file_url = serializers.SerializerMethodField()
    
    class Meta:
        model = ReportTemplate
        fields = [
            'id', 'name', 'description', 'report_type', 'template_file', 'template_file_url',
            'fields', 'filters', 'is_active', 'created_by', 'created_by_name',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']
    
    def get_created_by_name(self, obj):
        return obj.created_by.full_name
    
    def get_template_file_url(self, obj):
        if obj.template_file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.template_file.url)
        return None
    
    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)


class ReportSerializer(serializers.ModelSerializer):
    """Serializer for reports."""
    
    generated_by_name = serializers.SerializerMethodField()
    template_name = serializers.SerializerMethodField()
    file_url = serializers.SerializerMethodField()
    is_expired = serializers.SerializerMethodField()
    
    class Meta:
        model = Report
        fields = [
            'id', 'name', 'description', 'template', 'template_name', 'generated_by',
            'generated_by_name', 'status', 'format', 'filters_applied', 'file_path',
            'file_url', 'file_size', 'download_count', 'is_public', 'expires_at',
            'is_expired', 'created_at', 'completed_at'
        ]
        read_only_fields = [
            'id', 'generated_by', 'status', 'file_path', 'file_size', 'download_count',
            'created_at', 'completed_at'
        ]
    
    def get_generated_by_name(self, obj):
        return obj.generated_by.full_name
    
    def get_template_name(self, obj):
        return obj.template.name
    
    def get_file_url(self, obj):
        if obj.file_path:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(f'/api/reports/{obj.id}/download/')
        return None
    
    def get_is_expired(self, obj):
        return obj.is_expired()
    
    def create(self, validated_data):
        validated_data['generated_by'] = self.context['request'].user
        return super().create(validated_data)


class ReportCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating reports."""
    
    class Meta:
        model = Report
        fields = [
            'name', 'description', 'template', 'format', 'filters_applied',
            'is_public', 'expires_at'
        ]
    
    def create(self, validated_data):
        validated_data['generated_by'] = self.context['request'].user
        return super().create(validated_data)


class ReportScheduleSerializer(serializers.ModelSerializer):
    """Serializer for report schedules."""
    
    created_by_name = serializers.SerializerMethodField()
    template_name = serializers.SerializerMethodField()
    
    class Meta:
        model = ReportSchedule
        fields = [
            'id', 'name', 'template', 'template_name', 'created_by', 'created_by_name',
            'frequency', 'recipients', 'filters', 'format', 'is_active', 'last_run',
            'next_run', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_by', 'last_run', 'next_run', 'created_at', 'updated_at']
    
    def get_created_by_name(self, obj):
        return obj.created_by.full_name
    
    def get_template_name(self, obj):
        return obj.template.name
    
    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)


class ReportAccessSerializer(serializers.ModelSerializer):
    """Serializer for report access."""
    
    user_name = serializers.SerializerMethodField()
    granted_by_name = serializers.SerializerMethodField()
    report_name = serializers.SerializerMethodField()
    is_expired = serializers.SerializerMethodField()
    
    class Meta:
        model = ReportAccess
        fields = [
            'id', 'report', 'report_name', 'user', 'user_name', 'granted_by',
            'granted_by_name', 'granted_at', 'expires_at', 'is_expired'
        ]
        read_only_fields = ['id', 'granted_by', 'granted_at']
    
    def get_user_name(self, obj):
        return obj.user.full_name
    
    def get_granted_by_name(self, obj):
        return obj.granted_by.full_name
    
    def get_report_name(self, obj):
        return obj.report.name
    
    def get_is_expired(self, obj):
        return obj.is_expired()
    
    def create(self, validated_data):
        validated_data['granted_by'] = self.context['request'].user
        return super().create(validated_data)


class ReportAnalyticsSerializer(serializers.ModelSerializer):
    """Serializer for report analytics."""
    
    user_name = serializers.SerializerMethodField()
    report_name = serializers.SerializerMethodField()
    
    class Meta:
        model = ReportAnalytics
        fields = [
            'id', 'report', 'report_name', 'user', 'user_name', 'action',
            'ip_address', 'user_agent', 'timestamp'
        ]
        read_only_fields = ['id', 'timestamp']
    
    def get_user_name(self, obj):
        return obj.user.full_name
    
    def get_report_name(self, obj):
        return obj.report.name


class ReportStatsSerializer(serializers.Serializer):
    """Serializer for report statistics."""
    
    total_reports = serializers.IntegerField()
    pending_reports = serializers.IntegerField()
    completed_reports = serializers.IntegerField()
    failed_reports = serializers.IntegerField()
    total_downloads = serializers.IntegerField()
    templates_count = serializers.IntegerField()
    schedules_count = serializers.IntegerField()
    active_schedules = serializers.IntegerField()


class ReportAnalyticsSummarySerializer(serializers.Serializer):
    """Serializer for report analytics summary."""
    
    reports_by_type = serializers.DictField()
    reports_by_month = serializers.DictField()
    top_templates = serializers.ListField()
    download_trends = serializers.DictField()
    user_activity = serializers.ListField()
    popular_formats = serializers.DictField()
