from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Count, Q, Sum
from django.utils import timezone
from datetime import timedelta
from .models import ReportTemplate, Report, ReportSchedule, ReportAccess, ReportAnalytics
from .serializers import (
    ReportTemplateSerializer, ReportSerializer, ReportCreateSerializer,
    ReportScheduleSerializer, ReportAccessSerializer, ReportAnalyticsSerializer,
    ReportStatsSerializer, ReportAnalyticsSummarySerializer
)


class ReportTemplateListView(generics.ListCreateAPIView):
    """List and create report templates."""
    
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ReportTemplateSerializer
    
    def get_queryset(self):
        user = self.request.user
        queryset = ReportTemplate.objects.filter(is_active=True)
        
        # Students can only see basic templates
        if user.is_student():
            queryset = queryset.filter(report_type__in=['user_summary', 'achievement_report', 'certificate_report'])
        elif user.is_faculty():
            # Faculty can see most templates except admin-only ones
            queryset = queryset.exclude(report_type='analytics_report')
        
        return queryset.select_related('created_by').order_by('name')


class ReportTemplateDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Get, update, or delete a specific report template."""
    
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ReportTemplateSerializer
    queryset = ReportTemplate.objects.all()


class ReportListView(generics.ListCreateAPIView):
    """List and create reports."""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ReportCreateSerializer
        return ReportSerializer
    
    def get_queryset(self):
        user = self.request.user
        queryset = Report.objects.select_related('template', 'generated_by')
        
        if user.is_student():
            # Students can see their own reports and public ones
            queryset = queryset.filter(
                Q(generated_by=user) | Q(is_public=True)
            )
        elif user.is_faculty():
            # Faculty can see all reports
            queryset = queryset.all()
        elif user.is_admin():
            # Admins can see all reports
            queryset = queryset.all()
        
        # Apply filters
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        template_filter = self.request.query_params.get('template')
        if template_filter:
            queryset = queryset.filter(template_id=template_filter)
        
        return queryset.order_by('-created_at')


class ReportDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Get, update, or delete a specific report."""
    
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ReportSerializer
    
    def get_queryset(self):
        user = self.request.user
        queryset = Report.objects.select_related('template', 'generated_by')
        
        if user.is_student():
            # Students can only access their own reports
            queryset = queryset.filter(generated_by=user)
        elif user.is_faculty() or user.is_admin():
            # Faculty and admins can access all reports
            queryset = queryset.all()
        
        return queryset


class ReportScheduleListView(generics.ListCreateAPIView):
    """List and create report schedules."""
    
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ReportScheduleSerializer
    
    def get_queryset(self):
        user = self.request.user
        queryset = ReportSchedule.objects.select_related('template', 'created_by')
        
        if user.is_student():
            # Students can only see their own schedules
            queryset = queryset.filter(created_by=user)
        elif user.is_faculty() or user.is_admin():
            # Faculty and admins can see all schedules
            queryset = queryset.all()
        
        return queryset.order_by('name')


class ReportScheduleDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Get, update, or delete a specific report schedule."""
    
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ReportScheduleSerializer
    
    def get_queryset(self):
        user = self.request.user
        queryset = ReportSchedule.objects.select_related('template', 'created_by')
        
        if user.is_student():
            # Students can only access their own schedules
            queryset = queryset.filter(created_by=user)
        elif user.is_faculty() or user.is_admin():
            # Faculty and admins can access all schedules
            queryset = queryset.all()
        
        return queryset


class ReportAccessListView(generics.ListCreateAPIView):
    """List and create report access permissions."""
    
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ReportAccessSerializer
    
    def get_queryset(self):
        user = self.request.user
        queryset = ReportAccess.objects.select_related('report', 'user', 'granted_by')
        
        if user.is_student():
            # Students can only see their own access permissions
            queryset = queryset.filter(user=user)
        elif user.is_faculty() or user.is_admin():
            # Faculty and admins can see all access permissions
            queryset = queryset.all()
        
        return queryset.order_by('-granted_at')


class ReportAnalyticsListView(generics.ListAPIView):
    """List report analytics."""
    
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ReportAnalyticsSerializer
    
    def get_queryset(self):
        user = self.request.user
        queryset = ReportAnalytics.objects.select_related('report', 'user')
        
        if user.is_student():
            # Students can only see their own analytics
            queryset = queryset.filter(user=user)
        elif user.is_faculty() or user.is_admin():
            # Faculty and admins can see all analytics
            queryset = queryset.all()
        
        return queryset.order_by('-timestamp')


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def generate_report(request, template_id):
    """Generate a report from a template."""
    try:
        template = ReportTemplate.objects.get(id=template_id, is_active=True)
    except ReportTemplate.DoesNotExist:
        return Response({'error': 'Template not found.'}, status=status.HTTP_404_NOT_FOUND)
    
    # Check permissions
    user = request.user
    if user.is_student() and template.report_type in ['analytics_report']:
        return Response({'error': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)
    
    # Create report
    report_data = {
        'name': request.data.get('name', f"{template.name} - {timezone.now().strftime('%Y-%m-%d')}"),
        'description': request.data.get('description', ''),
        'template': template,
        'format': request.data.get('format', 'pdf'),
        'filters_applied': request.data.get('filters', {}),
        'is_public': request.data.get('is_public', False),
        'generated_by': user
    }
    
    report = Report.objects.create(**report_data)
    
    # Here you would typically trigger a background task to generate the report
    # For now, we'll just mark it as completed
    report.status = 'completed'
    report.completed_at = timezone.now()
    report.save()
    
    serializer = ReportSerializer(report, context={'request': request})
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def download_report(request, report_id):
    """Download a report file."""
    try:
        report = Report.objects.get(id=report_id)
    except Report.DoesNotExist:
        return Response({'error': 'Report not found.'}, status=status.HTTP_404_NOT_FOUND)
    
    # Check permissions
    user = request.user
    if user.is_student() and report.generated_by != user and not report.is_public:
        return Response({'error': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)
    
    # Check if report is expired
    if report.is_expired():
        return Response({'error': 'Report has expired.'}, status=status.HTTP_410_GONE)
    
    # Track download
    ReportAnalytics.objects.create(
        report=report,
        user=user,
        action='downloaded',
        ip_address=request.META.get('REMOTE_ADDR'),
        user_agent=request.META.get('HTTP_USER_AGENT', '')
    )
    
    # Increment download count
    report.download_count += 1
    report.save()
    
    # Here you would typically return the file
    # For now, we'll return a success message
    return Response({'message': 'Report download initiated.'}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def report_stats(request):
    """Get report statistics."""
    user = request.user
    
    if user.is_student():
        # Student stats
        reports = Report.objects.filter(generated_by=user)
        stats = {
            'total_reports': reports.count(),
            'pending_reports': reports.filter(status='pending').count(),
            'completed_reports': reports.filter(status='completed').count(),
            'failed_reports': reports.filter(status='failed').count(),
            'total_downloads': reports.aggregate(total=Sum('download_count'))['total'] or 0,
            'templates_count': ReportTemplate.objects.filter(is_active=True).count(),
            'schedules_count': ReportSchedule.objects.filter(created_by=user).count(),
            'active_schedules': ReportSchedule.objects.filter(created_by=user, is_active=True).count(),
        }
    else:
        # Admin/Faculty stats
        stats = {
            'total_reports': Report.objects.count(),
            'pending_reports': Report.objects.filter(status='pending').count(),
            'completed_reports': Report.objects.filter(status='completed').count(),
            'failed_reports': Report.objects.filter(status='failed').count(),
            'total_downloads': Report.objects.aggregate(total=Sum('download_count'))['total'] or 0,
            'templates_count': ReportTemplate.objects.filter(is_active=True).count(),
            'schedules_count': ReportSchedule.objects.count(),
            'active_schedules': ReportSchedule.objects.filter(is_active=True).count(),
        }
    
    serializer = ReportStatsSerializer(stats)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def report_analytics_summary(request):
    """Get report analytics summary (Admin/Faculty only)."""
    user = request.user
    
    if not (user.is_faculty() or user.is_admin()):
        return Response({'error': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)
    
    # Reports by type
    reports_by_type = {}
    for report_type, _ in ReportTemplate.REPORT_TYPES:
        count = Report.objects.filter(template__report_type=report_type).count()
        reports_by_type[report_type] = count
    
    # Reports by month (last 12 months)
    reports_by_month = {}
    for i in range(12):
        month = timezone.now() - timedelta(days=30*i)
        month_key = month.strftime('%Y-%m')
        count = Report.objects.filter(
            created_at__year=month.year,
            created_at__month=month.month
        ).count()
        reports_by_month[month_key] = count
    
    # Top templates
    top_templates = []
    for template_data in ReportTemplate.objects.annotate(
        report_count=Count('reports')
    ).order_by('-report_count')[:5]:
        top_templates.append({
            'name': template_data.name,
            'count': template_data.report_count
        })
    
    # Download trends
    download_trends = {
        'total_downloads': Report.objects.aggregate(total=Sum('download_count'))['total'] or 0,
        'avg_downloads_per_report': Report.objects.filter(download_count__gt=0).aggregate(
            avg=Sum('download_count') / Count('id')
        )['avg'] or 0
    }
    
    # User activity
    user_activity = []
    for user_data in Report.objects.values('generated_by').annotate(
        report_count=Count('id')
    ).order_by('-report_count')[:10]:
        user = User.objects.get(id=user_data['generated_by'])
        user_activity.append({
            'user_name': user.full_name,
            'report_count': user_data['report_count']
        })
    
    # Popular formats
    popular_formats = {}
    for format_choice, _ in Report.FORMAT_CHOICES:
        count = Report.objects.filter(format=format_choice).count()
        popular_formats[format_choice] = count
    
    analytics = {
        'reports_by_type': reports_by_type,
        'reports_by_month': reports_by_month,
        'top_templates': top_templates,
        'download_trends': download_trends,
        'user_activity': user_activity,
        'popular_formats': popular_formats,
    }
    
    serializer = ReportAnalyticsSummarySerializer(analytics)
    return Response(serializer.data)
