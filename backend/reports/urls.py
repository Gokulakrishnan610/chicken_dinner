from django.urls import path
from . import views

urlpatterns = [
    # Templates
    path('templates/', views.ReportTemplateListView.as_view(), name='report-template-list'),
    path('templates/<int:pk>/', views.ReportTemplateDetailView.as_view(), name='report-template-detail'),
    
    # Reports
    path('', views.ReportListView.as_view(), name='report-list'),
    path('<int:pk>/', views.ReportDetailView.as_view(), name='report-detail'),
    path('templates/<int:template_id>/generate/', views.generate_report, name='generate-report'),
    path('<int:report_id>/download/', views.download_report, name='download-report'),
    
    # Schedules
    path('schedules/', views.ReportScheduleListView.as_view(), name='report-schedule-list'),
    path('schedules/<int:pk>/', views.ReportScheduleDetailView.as_view(), name='report-schedule-detail'),
    
    # Access
    path('access/', views.ReportAccessListView.as_view(), name='report-access-list'),
    
    # Analytics
    path('analytics/', views.ReportAnalyticsListView.as_view(), name='report-analytics-list'),
    
    # Statistics
    path('stats/', views.report_stats, name='report-stats'),
    path('analytics-summary/', views.report_analytics_summary, name='report-analytics-summary'),
]
