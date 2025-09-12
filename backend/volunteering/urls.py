from django.urls import path
from . import views

urlpatterns = [
    # Categories
    path('categories/', views.VolunteeringCategoryListView.as_view(), name='volunteering-category-list'),
    
    # Activities
    path('activities/', views.VolunteeringActivityListView.as_view(), name='volunteering-activity-list'),
    path('activities/<int:pk>/', views.VolunteeringActivityDetailView.as_view(), name='volunteering-activity-detail'),
    path('activities/<int:pk>/approve/', views.VolunteeringApprovalView.as_view(), name='volunteering-approval'),
    
    # Comments
    path('activities/<int:activity_id>/comments/', views.VolunteeringCommentListView.as_view(), name='volunteering-comment-list'),
    
    # Likes and Shares
    path('activities/<int:activity_id>/like/', views.VolunteeringLikeView.as_view(), name='volunteering-like'),
    path('activities/<int:activity_id>/share/', views.VolunteeringShareView.as_view(), name='volunteering-share'),
    
    # Opportunities
    path('opportunities/', views.VolunteeringOpportunityListView.as_view(), name='volunteering-opportunity-list'),
    path('opportunities/<int:pk>/', views.VolunteeringOpportunityDetailView.as_view(), name='volunteering-opportunity-detail'),
    
    # Applications
    path('applications/', views.VolunteeringApplicationListView.as_view(), name='volunteering-application-list'),
    path('applications/<int:pk>/', views.VolunteeringApplicationDetailView.as_view(), name='volunteering-application-detail'),
    
    # Impacts
    path('activities/<int:activity_id>/impacts/', views.VolunteeringImpactListView.as_view(), name='volunteering-impact-list'),
    
    # Statistics and Analytics
    path('stats/', views.volunteering_stats, name='volunteering-stats'),
    path('analytics/', views.volunteering_analytics, name='volunteering-analytics'),
    path('pending-reviews/', views.pending_volunteering_reviews, name='pending-volunteering-reviews'),
]
