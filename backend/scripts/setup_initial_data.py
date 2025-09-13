#!/usr/bin/env python
"""
Script to set up initial data for the education portal.
Run this after migrations to populate the database with sample data.
"""

import os
import sys
import django
from django.conf import settings

# Add the project directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'eduportal.settings')
django.setup()

from django.contrib.auth import get_user_model
from accounts.models import UserProfile, Department
from achievements.models import AchievementCategory, Achievement, AchievementBadge
from certificates.models import CertificateCategory, Certificate
from volunteering.models import VolunteeringCategory, VolunteeringActivity, VolunteeringOpportunity
from notifications.models import NotificationType, Notification, NotificationTemplate

User = get_user_model()

def create_departments():
    """Create sample departments."""
    departments = [
        {'name': 'Computer Science', 'code': 'CS', 'description': 'Computer Science Department'},
        {'name': 'Information Technology', 'code': 'IT', 'description': 'Information Technology Department'},
        {'name': 'Data Science', 'code': 'DS', 'description': 'Data Science Department'},
        {'name': 'Cybersecurity', 'code': 'CY', 'description': 'Cybersecurity Department'},
    ]
    
    for dept_data in departments:
        dept, created = Department.objects.get_or_create(
            code=dept_data['code'],
            defaults=dept_data
        )
        if created:
            print(f"Created department: {dept.name}")

def create_users():
    """Create sample users."""
    # Create admin user
    admin_user, created = User.objects.get_or_create(
        email='admin@eduportal.com',
        defaults={
            'username': 'admin',
            'first_name': 'Admin',
            'last_name': 'User',
            'role': 'admin',
            'is_staff': True,
            'is_superuser': True,
        }
    )
    if created:
        admin_user.set_password('admin123')
        admin_user.save()
        UserProfile.objects.create(user=admin_user)
        print("Created admin user: admin@eduportal.com")

    # Create faculty users
    faculty_data = [
        {'email': 'faculty1@eduportal.com', 'first_name': 'Dr. Sarah', 'last_name': 'Johnson', 'department': 'Computer Science'},
        {'email': 'faculty2@eduportal.com', 'first_name': 'Prof. Michael', 'last_name': 'Chen', 'department': 'Data Science'},
        {'email': 'faculty3@eduportal.com', 'first_name': 'Dr. Emily', 'last_name': 'Davis', 'department': 'Cybersecurity'},
    ]
    
    for faculty_info in faculty_data:
        user, created = User.objects.get_or_create(
            email=faculty_info['email'],
            defaults={
                'username': faculty_info['email'].split('@')[0],
                'first_name': faculty_info['first_name'],
                'last_name': faculty_info['last_name'],
                'role': 'faculty',
                'department': faculty_info['department'],
            }
        )
        if created:
            user.set_password('faculty123')
            user.save()
            UserProfile.objects.create(user=user)
            print(f"Created faculty user: {faculty_info['email']}")

    # Create student users
    student_data = [
        {'email': 'student1@eduportal.com', 'first_name': 'John', 'last_name': 'Doe', 'student_id': 'STU001', 'department': 'Computer Science'},
        {'email': 'student2@eduportal.com', 'first_name': 'Jane', 'last_name': 'Smith', 'student_id': 'STU002', 'department': 'Data Science'},
        {'email': 'student3@eduportal.com', 'first_name': 'Bob', 'last_name': 'Wilson', 'student_id': 'STU003', 'department': 'Information Technology'},
        {'email': 'student4@eduportal.com', 'first_name': 'Alice', 'last_name': 'Brown', 'student_id': 'STU004', 'department': 'Cybersecurity'},
    ]
    
    for student_info in student_data:
        user, created = User.objects.get_or_create(
            email=student_info['email'],
            defaults={
                'username': student_info['email'].split('@')[0],
                'first_name': student_info['first_name'],
                'last_name': student_info['last_name'],
                'role': 'student',
                'student_id': student_info['student_id'],
                'department': student_info['department'],
            }
        )
        if created:
            user.set_password('student123')
            user.save()
            UserProfile.objects.create(user=user)
            print(f"Created student user: {student_info['email']}")

def create_achievement_categories():
    """Create achievement categories."""
    categories = [
        {'name': 'Academic Excellence', 'description': 'Academic achievements and academic performance', 'icon': '🎓', 'color': '#3B82F6', 'points_multiplier': 1.5},
        {'name': 'Technical Skills', 'description': 'Programming, software development, and technical certifications', 'icon': '💻', 'color': '#10B981', 'points_multiplier': 1.2},
        {'name': 'Leadership', 'description': 'Leadership roles and team management', 'icon': '👑', 'color': '#F59E0B', 'points_multiplier': 1.3},
        {'name': 'Community Service', 'description': 'Volunteering and community involvement', 'icon': '🤝', 'color': '#EF4444', 'points_multiplier': 1.0},
        {'name': 'Innovation', 'description': 'Innovative projects and creative solutions', 'icon': '💡', 'color': '#8B5CF6', 'points_multiplier': 1.4},
    ]
    
    for cat_data in categories:
        cat, created = AchievementCategory.objects.get_or_create(
            name=cat_data['name'],
            defaults=cat_data
        )
        if created:
            print(f"Created achievement category: {cat.name}")

def create_certificate_categories():
    """Create certificate categories."""
    categories = [
        {'name': 'Programming Languages', 'description': 'Programming language certifications', 'icon': '🐍', 'color': '#10B981', 'points_value': 25},
        {'name': 'Cloud Computing', 'description': 'Cloud platform certifications', 'icon': '☁️', 'color': '#3B82F6', 'points_value': 30},
        {'name': 'Data Science', 'description': 'Data science and analytics certifications', 'icon': '📊', 'color': '#8B5CF6', 'points_value': 35},
        {'name': 'Cybersecurity', 'description': 'Security and cybersecurity certifications', 'icon': '🔒', 'color': '#EF4444', 'points_value': 40},
        {'name': 'Project Management', 'description': 'Project management certifications', 'icon': '📋', 'color': '#F59E0B', 'points_value': 20},
    ]
    
    for cat_data in categories:
        cat, created = CertificateCategory.objects.get_or_create(
            name=cat_data['name'],
            defaults=cat_data
        )
        if created:
            print(f"Created certificate category: {cat.name}")

def create_volunteering_categories():
    """Create volunteering categories."""
    categories = [
        {'name': 'Education', 'description': 'Teaching and educational support', 'icon': '📚', 'color': '#3B82F6', 'points_per_hour': 2.0},
        {'name': 'Environment', 'description': 'Environmental conservation and sustainability', 'icon': '🌱', 'color': '#10B981', 'points_per_hour': 1.5},
        {'name': 'Community', 'description': 'Community development and support', 'icon': '🏘️', 'color': '#F59E0B', 'points_per_hour': 1.0},
        {'name': 'Technology', 'description': 'Tech for good and digital inclusion', 'icon': '💻', 'color': '#8B5CF6', 'points_per_hour': 2.5},
        {'name': 'Health', 'description': 'Health and wellness initiatives', 'icon': '🏥', 'color': '#EF4444', 'points_per_hour': 1.8},
    ]
    
    for cat_data in categories:
        cat, created = VolunteeringCategory.objects.get_or_create(
            name=cat_data['name'],
            defaults=cat_data
        )
        if created:
            print(f"Created volunteering category: {cat.name}")

def create_notification_types():
    """Create notification types."""
    types = [
        {'name': 'achievement', 'description': 'Achievement notifications', 'icon': '🏆', 'color': '#3B82F6'},
        {'name': 'certificate', 'description': 'Certificate notifications', 'icon': '📜', 'color': '#10B981'},
        {'name': 'volunteering', 'description': 'Volunteering notifications', 'icon': '🤝', 'color': '#F59E0B'},
        {'name': 'system_alert', 'description': 'System alerts and updates', 'icon': '⚠️', 'color': '#EF4444'},
        {'name': 'admin_notification', 'description': 'Administrative notifications', 'icon': '📢', 'color': '#8B5CF6'},
    ]
    
    for type_data in types:
        nt, created = NotificationType.objects.get_or_create(
            name=type_data['name'],
            defaults=type_data
        )
        if created:
            print(f"Created notification type: {nt.name}")

def create_sample_achievements():
    """Create sample achievements."""
    students = User.objects.filter(role='student')
    categories = AchievementCategory.objects.all()
    
    if students.exists() and categories.exists():
        sample_achievements = [
            {
                'title': 'Python Programming Excellence',
                'description': 'Completed advanced Python programming course with distinction',
                'category': categories.filter(name='Technical Skills').first(),
                'points': 50,
                'skills_gained': ['Python', 'Programming', 'Problem Solving'],
                'tags': ['programming', 'python', 'course'],
            },
            {
                'title': 'Student Council President',
                'description': 'Elected as Student Council President for academic year 2024',
                'category': categories.filter(name='Leadership').first(),
                'points': 75,
                'skills_gained': ['Leadership', 'Public Speaking', 'Team Management'],
                'tags': ['leadership', 'student government', 'election'],
            },
            {
                'title': 'Hackathon Winner',
                'description': 'Won first place in university hackathon with innovative mobile app',
                'category': categories.filter(name='Innovation').first(),
                'points': 100,
                'skills_gained': ['Mobile Development', 'UI/UX Design', 'Teamwork'],
                'tags': ['hackathon', 'mobile app', 'innovation'],
            },
        ]
        
        for student in students[:2]:  # Create for first 2 students
            for achievement_data in sample_achievements:
                achievement, created = Achievement.objects.get_or_create(
                    user=student,
                    title=achievement_data['title'],
                    defaults={
                        **achievement_data,
                        'status': 'approved',
                        'priority': 'high',
                        'is_public': True,
                    }
                )
                if created:
                    print(f"Created achievement for {student.full_name}: {achievement.title}")

def create_sample_certificates():
    """Create sample certificates."""
    students = User.objects.filter(role='student')
    categories = CertificateCategory.objects.all()
    
    if students.exists() and categories.exists():
        sample_certificates = [
            {
                'title': 'AWS Cloud Practitioner',
                'description': 'Amazon Web Services Cloud Practitioner certification',
                'category': categories.filter(name='Cloud Computing').first(),
                'issuer': 'Amazon Web Services',
                'issue_date': '2024-01-15',
                'points': 30,
                'skills_verified': ['Cloud Computing', 'AWS', 'Infrastructure'],
                'tags': ['aws', 'cloud', 'certification'],
            },
            {
                'title': 'Python Programming Certificate',
                'description': 'Advanced Python programming certification',
                'category': categories.filter(name='Programming Languages').first(),
                'issuer': 'Python Institute',
                'issue_date': '2024-02-01',
                'points': 25,
                'skills_verified': ['Python', 'Programming', 'OOP'],
                'tags': ['python', 'programming', 'certification'],
            },
        ]
        
        for student in students[:2]:  # Create for first 2 students
            for cert_data in sample_certificates:
                certificate, created = Certificate.objects.get_or_create(
                    user=student,
                    title=cert_data['title'],
                    defaults={
                        **cert_data,
                        'status': 'approved',
                        'priority': 'high',
                        'is_public': True,
                    }
                )
                if created:
                    print(f"Created certificate for {student.full_name}: {certificate.title}")

def create_sample_volunteering_activities():
    """Create sample volunteering activities."""
    students = User.objects.filter(role='student')
    categories = VolunteeringCategory.objects.all()
    
    if students.exists() and categories.exists():
        sample_activities = [
            {
                'title': 'Coding Bootcamp for Kids',
                'description': 'Taught basic programming concepts to elementary school students',
                'category': categories.filter(name='Education').first(),
                'organization': 'Local Elementary School',
                'location': 'Community Center',
                'activity_date': '2024-01-20',
                'hours_volunteered': 8.0,
                'skills_developed': ['Teaching', 'Communication', 'Patience'],
                'tags': ['education', 'programming', 'kids'],
            },
            {
                'title': 'Beach Cleanup Drive',
                'description': 'Organized and participated in beach cleanup initiative',
                'category': categories.filter(name='Environment').first(),
                'organization': 'Green Earth Foundation',
                'location': 'Sunset Beach',
                'activity_date': '2024-02-05',
                'hours_volunteered': 6.0,
                'skills_developed': ['Organization', 'Environmental Awareness', 'Teamwork'],
                'tags': ['environment', 'cleanup', 'sustainability'],
            },
        ]
        
        for student in students[:2]:  # Create for first 2 students
            for activity_data in sample_activities:
                activity, created = VolunteeringActivity.objects.get_or_create(
                    user=student,
                    title=activity_data['title'],
                    defaults={
                        **activity_data,
                        'status': 'approved',
                        'priority': 'medium',
                        'is_public': True,
                    }
                )
                if created:
                    print(f"Created volunteering activity for {student.full_name}: {activity.title}")

def main():
    """Main function to set up all initial data."""
    print("Setting up initial data for Education Portal...")
    
    create_departments()
    create_users()
    create_achievement_categories()
    create_certificate_categories()
    create_volunteering_categories()
    create_notification_types()
    create_sample_achievements()
    create_sample_certificates()
    create_sample_volunteering_activities()
    
    print("\nInitial data setup completed!")
    print("\nSample users created:")
    print("Admin: admin@eduportal.com / admin123")
    print("Faculty: faculty1@eduportal.com / faculty123")
    print("Students: student1@eduportal.com / student123")

if __name__ == '__main__':
    main()