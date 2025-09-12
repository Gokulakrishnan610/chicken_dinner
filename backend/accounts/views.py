from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import login, logout
from django.db.models import Count, Q
from django.utils import timezone
from datetime import timedelta
from .models import User, UserProfile, Department, UserSession
from .serializers import (
    UserRegistrationSerializer, UserLoginSerializer, UserProfileSerializer,
    ExtendedUserProfileSerializer, UserUpdateSerializer, PasswordChangeSerializer,
    DepartmentSerializer, UserSessionSerializer, UserStatsSerializer
)


class UserRegistrationView(APIView):
    """User registration endpoint."""
    
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserProfileSerializer(user, context={'request': request}).data,
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserLoginView(APIView):
    """User login endpoint."""
    
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            login(request, user)
            
            # Track session
            UserSession.objects.create(
                user=user,
                session_key=request.session.session_key,
                ip_address=self.get_client_ip(request),
                user_agent=request.META.get('HTTP_USER_AGENT', '')
            )
            
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserProfileSerializer(user, context={'request': request}).data,
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


class UserLogoutView(APIView):
    """User logout endpoint."""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            
            # Deactivate current session
            UserSession.objects.filter(
                user=request.user,
                session_key=request.session.session_key
            ).update(is_active=False)
            
            logout(request)
            return Response({'message': 'Successfully logged out.'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': 'Invalid token.'}, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(generics.RetrieveUpdateAPIView):
    """Get and update user profile."""
    
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserProfileSerializer
    
    def get_object(self):
        return self.request.user


class ExtendedUserProfileView(generics.RetrieveUpdateAPIView):
    """Get and update extended user profile."""
    
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ExtendedUserProfileSerializer
    
    def get_object(self):
        profile, created = UserProfile.objects.get_or_create(user=self.request.user)
        return profile


class PasswordChangeView(APIView):
    """Change user password."""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        serializer = PasswordChangeSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = request.user
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            return Response({'message': 'Password changed successfully.'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserListView(generics.ListAPIView):
    """List all users (Admin only)."""
    
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserProfileSerializer
    queryset = User.objects.all()
    
    def get_queryset(self):
        if not self.request.user.is_admin():
            return User.objects.none()
        return User.objects.all().order_by('-date_joined')


class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Get, update, or delete a specific user (Admin only)."""
    
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserProfileSerializer
    queryset = User.objects.all()
    
    def get_queryset(self):
        if not self.request.user.is_admin():
            return User.objects.none()
        return User.objects.all()


class DepartmentListView(generics.ListCreateAPIView):
    """List and create departments."""
    
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = DepartmentSerializer
    queryset = Department.objects.all()
    
    def get_queryset(self):
        if not self.request.user.is_admin():
            return Department.objects.none()
        return Department.objects.all()


class DepartmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Get, update, or delete a specific department."""
    
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = DepartmentSerializer
    queryset = Department.objects.all()
    
    def get_queryset(self):
        if not self.request.user.is_admin():
            return Department.objects.none()
        return Department.objects.all()


class UserSessionListView(generics.ListAPIView):
    """List user sessions (Admin only)."""
    
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSessionSerializer
    queryset = UserSession.objects.all()
    
    def get_queryset(self):
        if not self.request.user.is_admin():
            return UserSession.objects.none()
        return UserSession.objects.filter(is_active=True).order_by('-login_time')


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def user_stats(request):
    """Get user statistics (Admin only)."""
    if not request.user.is_admin():
        return Response({'error': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)
    
    now = timezone.now()
    month_ago = now - timedelta(days=30)
    
    stats = {
        'total_users': User.objects.count(),
        'students_count': User.objects.filter(role='student').count(),
        'faculty_count': User.objects.filter(role='faculty').count(),
        'admins_count': User.objects.filter(role='admin').count(),
        'active_users': User.objects.filter(is_active=True).count(),
        'new_users_this_month': User.objects.filter(date_joined__gte=month_ago).count(),
        'departments_count': Department.objects.count(),
    }
    
    serializer = UserStatsSerializer(stats)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def dashboard_data(request):
    """Get dashboard data based on user role."""
    user = request.user
    
    if user.is_admin():
        # Admin dashboard data
        return Response({
            'role': 'admin',
            'stats': {
                'total_users': User.objects.count(),
                'students_count': User.objects.filter(role='student').count(),
                'faculty_count': User.objects.filter(role='faculty').count(),
                'active_sessions': UserSession.objects.filter(is_active=True).count(),
            }
        })
    elif user.is_faculty():
        # Faculty dashboard data
        return Response({
            'role': 'faculty',
            'stats': {
                'pending_reviews': 0,  # Will be implemented in certificates app
                'total_reviews': 0,
                'students_mentored': 0,
            }
        })
    else:
        # Student dashboard data
        profile = user.profile
        return Response({
            'role': 'student',
            'stats': {
                'total_certificates': profile.certificates_count,
                'total_achievements': profile.achievements_count,
                'volunteering_hours': profile.volunteering_hours,
                'total_points': profile.total_points,
            }
        })
