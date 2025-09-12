from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from .models import User, UserProfile, Department, UserSession


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration."""
    
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = [
            'email', 'username', 'first_name', 'last_name', 'role',
            'student_id', 'department', 'phone', 'password', 'password_confirm'
        ]
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match.")
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        # Create user profile
        UserProfile.objects.create(user=user)
        return user


class UserLoginSerializer(serializers.Serializer):
    """Serializer for user login."""
    
    email = serializers.EmailField()
    password = serializers.CharField()
    
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        
        if email and password:
            user = authenticate(username=email, password=password)
            if not user:
                raise serializers.ValidationError('Invalid credentials.')
            if not user.is_active:
                raise serializers.ValidationError('User account is disabled.')
            attrs['user'] = user
            return attrs
        else:
            raise serializers.ValidationError('Must include email and password.')


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for user profile."""
    
    full_name = serializers.ReadOnlyField()
    profile_picture_url = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'email', 'username', 'first_name', 'last_name', 'full_name',
            'role', 'student_id', 'department', 'phone', 'profile_picture',
            'profile_picture_url', 'bio', 'is_verified', 'date_joined',
            'last_login', 'is_active'
        ]
        read_only_fields = ['id', 'date_joined', 'last_login', 'is_active']
    
    def get_profile_picture_url(self, obj):
        if obj.profile_picture:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.profile_picture.url)
        return None


class ExtendedUserProfileSerializer(serializers.ModelSerializer):
    """Extended serializer with profile details."""
    
    user = UserProfileSerializer(read_only=True)
    
    class Meta:
        model = UserProfile
        fields = [
            'user', 'date_of_birth', 'address', 'city', 'state', 'country',
            'postal_code', 'linkedin_url', 'github_url', 'portfolio_url',
            'skills', 'interests', 'achievements_count', 'certificates_count',
            'volunteering_hours', 'total_points'
        ]


class UserUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating user information."""
    
    class Meta:
        model = User
        fields = [
            'first_name', 'last_name', 'phone', 'profile_picture', 'bio'
        ]


class PasswordChangeSerializer(serializers.Serializer):
    """Serializer for password change."""
    
    old_password = serializers.CharField()
    new_password = serializers.CharField(validators=[validate_password])
    new_password_confirm = serializers.CharField()
    
    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError("New passwords don't match.")
        return attrs
    
    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect.")
        return value


class DepartmentSerializer(serializers.ModelSerializer):
    """Serializer for departments."""
    
    head_name = serializers.SerializerMethodField()
    user_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Department
        fields = [
            'id', 'name', 'code', 'description', 'head', 'head_name',
            'user_count', 'created_at', 'updated_at'
        ]
    
    def get_head_name(self, obj):
        return obj.head.full_name if obj.head else None
    
    def get_user_count(self, obj):
        return User.objects.filter(department=obj.name).count()


class UserSessionSerializer(serializers.ModelSerializer):
    """Serializer for user sessions."""
    
    user_name = serializers.SerializerMethodField()
    
    class Meta:
        model = UserSession
        fields = [
            'id', 'user', 'user_name', 'ip_address', 'user_agent',
            'login_time', 'last_activity', 'is_active'
        ]
    
    def get_user_name(self, obj):
        return obj.user.full_name


class UserStatsSerializer(serializers.Serializer):
    """Serializer for user statistics."""
    
    total_users = serializers.IntegerField()
    students_count = serializers.IntegerField()
    faculty_count = serializers.IntegerField()
    admins_count = serializers.IntegerField()
    active_users = serializers.IntegerField()
    new_users_this_month = serializers.IntegerField()
    departments_count = serializers.IntegerField()
