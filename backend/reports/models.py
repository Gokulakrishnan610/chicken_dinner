from django.db import models
from django.conf import settings
from django.utils import timezone


class ReportTemplate(models.Model):
    """Templates for generating reports."""
    
    REPORT_TYPES = [
        ('user_summary', 'User Summary'),
        ('achievement_report', 'Achievement Report'),
        ('certificate_report', 'Certificate Report'),
        ('volunteering_report', 'Volunteering Report'),
        ('analytics_report', 'Analytics Report'),
        ('custom', 'Custom Report'),
    ]
    
    name = models.CharField(max_length=200)
    description = models.TextField()
    report_type = models.CharField(max_length=20, choices=REPORT_TYPES)
    template_file = models.FileField(upload_to='report_templates/', blank=True, null=True)
    fields = models.JSONField(default=list)  # Fields to include in the report
    filters = models.JSONField(default=dict)  # Available filters
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'report_templates'
        verbose_name = 'Report Template'
        verbose_name_plural = 'Report Templates'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class Report(models.Model):
    """Generated reports."""
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('generating', 'Generating'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]
    
    FORMAT_CHOICES = [
        ('pdf', 'PDF'),
        ('excel', 'Excel'),
        ('csv', 'CSV'),
        ('json', 'JSON'),
    ]
    
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    template = models.ForeignKey(ReportTemplate, on_delete=models.CASCADE, related_name='reports')
    generated_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='generated_reports')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    format = models.CharField(max_length=10, choices=FORMAT_CHOICES, default='pdf')
    filters_applied = models.JSONField(default=dict)
    file_path = models.CharField(max_length=500, blank=True)
    file_size = models.PositiveIntegerField(null=True, blank=True)
    download_count = models.PositiveIntegerField(default=0)
    is_public = models.BooleanField(default=False)
    expires_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'reports'
        verbose_name = 'Report'
        verbose_name_plural = 'Reports'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} - {self.generated_by.full_name}"
    
    def is_expired(self):
        if self.expires_at:
            return timezone.now() > self.expires_at
        return False


class ReportSchedule(models.Model):
    """Scheduled report generation."""
    
    FREQUENCY_CHOICES = [
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
        ('quarterly', 'Quarterly'),
        ('yearly', 'Yearly'),
    ]
    
    name = models.CharField(max_length=200)
    template = models.ForeignKey(ReportTemplate, on_delete=models.CASCADE, related_name='schedules')
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='report_schedules')
    frequency = models.CharField(max_length=10, choices=FREQUENCY_CHOICES)
    recipients = models.JSONField(default=list)  # List of email addresses
    filters = models.JSONField(default=dict)
    format = models.CharField(max_length=10, choices=Report.FORMAT_CHOICES, default='pdf')
    is_active = models.BooleanField(default=True)
    last_run = models.DateTimeField(null=True, blank=True)
    next_run = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'report_schedules'
        verbose_name = 'Report Schedule'
        verbose_name_plural = 'Report Schedules'
        ordering = ['name']
    
    def __str__(self):
        return f"{self.name} - {self.frequency}"


class ReportAccess(models.Model):
    """Track who has access to which reports."""
    
    report = models.ForeignKey(Report, on_delete=models.CASCADE, related_name='accesses')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='report_accesses')
    granted_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='granted_report_accesses')
    granted_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'report_accesses'
        verbose_name = 'Report Access'
        verbose_name_plural = 'Report Accesses'
        unique_together = ['report', 'user']
    
    def __str__(self):
        return f"{self.user.full_name} - {self.report.name}"
    
    def is_expired(self):
        if self.expires_at:
            return timezone.now() > self.expires_at
        return False


class ReportAnalytics(models.Model):
    """Analytics for report usage."""
    
    report = models.ForeignKey(Report, on_delete=models.CASCADE, related_name='analytics')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='report_analytics')
    action = models.CharField(max_length=20)  # 'viewed', 'downloaded', 'shared'
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'report_analytics'
        verbose_name = 'Report Analytics'
        verbose_name_plural = 'Report Analytics'
        ordering = ['-timestamp']
    
    def __str__(self):
        return f"{self.user.full_name} - {self.action} - {self.report.name}"
