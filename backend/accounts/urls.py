from django.urls import path
from . import views

urlpatterns = [
    # Authentication
    path('register/', views.UserRegistrationView.as_view(), name='user-register'),
    path('login/', views.UserLoginView.as_view(), name='user-login'),
    path('logout/', views.UserLogoutView.as_view(), name='user-logout'),
    
    # User Profile
    path('profile/', views.UserProfileView.as_view(), name='user-profile'),
    path('profile/extended/', views.ExtendedUserProfileView.as_view(), name='extended-user-profile'),
    path('change-password/', views.PasswordChangeView.as_view(), name='change-password'),
    
    # User Management (Admin only)
    path('users/', views.UserListView.as_view(), name='user-list'),
    path('users/<int:pk>/', views.UserDetailView.as_view(), name='user-detail'),
    
    # Departments
    path('departments/', views.DepartmentListView.as_view(), name='department-list'),
    path('departments/<int:pk>/', views.DepartmentDetailView.as_view(), name='department-detail'),
    
    # Sessions
    path('sessions/', views.UserSessionListView.as_view(), name='user-session-list'),
    
    # Statistics
    path('stats/', views.user_stats, name='user-stats'),
    path('dashboard/', views.dashboard_data, name='dashboard-data'),
]
