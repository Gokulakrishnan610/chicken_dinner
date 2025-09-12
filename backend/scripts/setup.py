#!/usr/bin/env python
"""
Setup script for EduPortal backend.
This script helps set up the development environment.
"""

import os
import sys
import subprocess
import django
from django.core.management import execute_from_command_line

def run_command(command, description):
    """Run a command and handle errors."""
    print(f"Running: {description}")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✓ {description} completed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"✗ {description} failed: {e.stderr}")
        return False

def setup_environment():
    """Set up the development environment."""
    print("Setting up EduPortal Backend Development Environment")
    print("=" * 50)
    
    # Check Python version
    if sys.version_info < (3, 8):
        print("✗ Python 3.8+ is required")
        return False
    
    print(f"✓ Python {sys.version_info.major}.{sys.version_info.minor} detected")
    
    # Install dependencies
    if not run_command("pip install -r requirements.txt", "Installing Python dependencies"):
        return False
    
    # Set up environment file
    if not os.path.exists('.env'):
        if os.path.exists('env.example'):
            run_command("cp env.example .env", "Creating .env file from template")
            print("⚠️  Please edit .env file with your configuration")
        else:
            print("✗ env.example file not found")
            return False
    
    # Set Django settings
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'eduportal.settings')
    django.setup()
    
    # Run migrations
    if not run_command("python manage.py migrate", "Running database migrations"):
        return False
    
    # Create superuser if it doesn't exist
    try:
        from django.contrib.auth import get_user_model
        User = get_user_model()
        if not User.objects.filter(is_superuser=True).exists():
            print("Creating superuser...")
            username = input("Enter superuser username (default: admin): ") or "admin"
            email = input("Enter superuser email: ")
            password = input("Enter superuser password: ")
            
            User.objects.create_superuser(username=username, email=email, password=password)
            print("✓ Superuser created successfully")
        else:
            print("✓ Superuser already exists")
    except Exception as e:
        print(f"⚠️  Could not create superuser: {e}")
    
    # Load initial data
    if os.path.exists('fixtures/initial_data.json'):
        if not run_command("python manage.py loaddata fixtures/initial_data.json", "Loading initial data"):
            print("⚠️  Could not load initial data")
    
    # Create media directories
    os.makedirs('media/achievements/evidence', exist_ok=True)
    os.makedirs('media/certificates', exist_ok=True)
    os.makedirs('media/volunteering/evidence', exist_ok=True)
    os.makedirs('media/profiles', exist_ok=True)
    os.makedirs('logs', exist_ok=True)
    
    print("✓ Media directories created")
    
    print("\n" + "=" * 50)
    print("Setup completed successfully!")
    print("\nNext steps:")
    print("1. Edit .env file with your configuration")
    print("2. Start the development server: python manage.py runserver")
    print("3. Access the admin panel at: http://localhost:8000/admin/")
    print("4. API documentation available at: http://localhost:8000/api/")
    
    return True

if __name__ == "__main__":
    success = setup_environment()
    sys.exit(0 if success else 1)
