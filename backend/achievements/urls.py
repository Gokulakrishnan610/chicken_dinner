from django.urls import path
from . import views

urlpatterns = [
    # Categories
    path('categories/', views.AchievementCategoryListView.as_view(), name='achievement-category-list'),
    
    # Achievements
    path('', views.AchievementListView.as_view(), name='achievement-list'),
    path('<int:pk>/', views.AchievementDetailView.as_view(), name='achievement-detail'),
    path('<int:pk>/approve/', views.AchievementApprovalView.as_view(), name='achievement-approval'),
    
    # Comments
    path('<int:achievement_id>/comments/', views.AchievementCommentListView.as_view(), name='achievement-comment-list'),
    
    # Likes and Shares
    path('<int:achievement_id>/like/', views.AchievementLikeView.as_view(), name='achievement-like'),
    path('<int:achievement_id>/share/', views.AchievementShareView.as_view(), name='achievement-share'),
    
    # Badges
    path('badges/', views.AchievementBadgeListView.as_view(), name='achievement-badge-list'),
    path('badges/user/<int:user_id>/', views.UserBadgeListView.as_view(), name='user-badge-list'),
    path('badges/user/', views.UserBadgeListView.as_view(), name='my-badge-list'),
    
    # Statistics and Analytics
    path('stats/', views.achievement_stats, name='achievement-stats'),
    path('analytics/', views.achievement_analytics, name='achievement-analytics'),
]
