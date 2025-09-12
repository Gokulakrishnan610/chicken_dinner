from django.urls import path
from . import views

urlpatterns = [
    # Categories
    path('categories/', views.CertificateCategoryListView.as_view(), name='certificate-category-list'),
    
    # Certificates
    path('', views.CertificateListView.as_view(), name='certificate-list'),
    path('<int:pk>/', views.CertificateDetailView.as_view(), name='certificate-detail'),
    path('<int:pk>/approve/', views.CertificateApprovalView.as_view(), name='certificate-approval'),
    
    # Reviews
    path('<int:certificate_id>/reviews/', views.CertificateReviewListView.as_view(), name='certificate-review-list'),
    
    # Comments
    path('<int:certificate_id>/comments/', views.CertificateCommentListView.as_view(), name='certificate-comment-list'),
    
    # Likes and Shares
    path('<int:certificate_id>/like/', views.CertificateLikeView.as_view(), name='certificate-like'),
    path('<int:certificate_id>/share/', views.CertificateShareView.as_view(), name='certificate-share'),
    
    # Templates
    path('templates/', views.CertificateTemplateListView.as_view(), name='certificate-template-list'),
    
    # Verification
    path('<int:certificate_id>/verify/', views.CertificateVerificationView.as_view(), name='certificate-verification'),
    
    # Statistics and Analytics
    path('stats/', views.certificate_stats, name='certificate-stats'),
    path('analytics/', views.certificate_analytics, name='certificate-analytics'),
    path('pending-reviews/', views.pending_reviews, name='pending-reviews'),
]
