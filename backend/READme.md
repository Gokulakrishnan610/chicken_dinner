# EduPortal Backend

A comprehensive Django REST API backend for the EduPortal system, supporting student, faculty, and admin frontends.

## Features

### Core Functionality
- **User Management**: Role-based authentication (Student, Faculty, Admin)
- **Achievements**: Track and manage student achievements with approval workflow
- **Certificates**: Certificate upload, verification, and management
- **Volunteering**: Log volunteering activities and track community service
- **Reports**: Generate and manage various reports
- **Notifications**: Comprehensive notification system

### Technical Features
- JWT Authentication
- Role-based permissions
- File upload handling
- Email notifications
- Background task processing with Celery
- Redis caching
- PostgreSQL database
- RESTful API design
- Comprehensive analytics and reporting

## Installation

### Prerequisites
- Python 3.8+
- PostgreSQL 12+
- Redis 6+
- Node.js (for frontend development)

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment configuration**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

5. **Database setup**
   ```bash
   # Create PostgreSQL database
   createdb eduportal
   
   # Run migrations
   python manage.py migrate
   ```

6. **Create superuser**
   ```bash
   python manage.py createsuperuser
   ```

7. **Load initial data**
   ```bash
   python manage.py loaddata initial_data.json
   ```

## Running the Application

### Development Server
```bash
python manage.py runserver
```

### Production Server
```bash
gunicorn eduportal.wsgi:application
```

### Celery Worker (for background tasks)
```bash
celery -A eduportal worker -l info
```

### Celery Beat (for scheduled tasks)
```bash
celery -A eduportal beat -l info
```

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout
- `GET /api/auth/profile/` - Get user profile
- `PUT /api/auth/profile/` - Update user profile

### Achievement Endpoints
- `GET /api/achievements/` - List achievements
- `POST /api/achievements/` - Create achievement
- `GET /api/achievements/{id}/` - Get achievement details
- `PUT /api/achievements/{id}/` - Update achievement
- `POST /api/achievements/{id}/approve/` - Approve/reject achievement

### Certificate Endpoints
- `GET /api/certificates/` - List certificates
- `POST /api/certificates/` - Upload certificate
- `GET /api/certificates/{id}/` - Get certificate details
- `PUT /api/certificates/{id}/` - Update certificate
- `POST /api/certificates/{id}/approve/` - Approve/reject certificate

### Volunteering Endpoints
- `GET /api/volunteering/activities/` - List volunteering activities
- `POST /api/volunteering/activities/` - Log volunteering activity
- `GET /api/volunteering/opportunities/` - List volunteering opportunities
- `POST /api/volunteering/applications/` - Apply for volunteering opportunity

### Report Endpoints
- `GET /api/reports/` - List reports
- `POST /api/reports/templates/{id}/generate/` - Generate report
- `GET /api/reports/{id}/download/` - Download report

### Notification Endpoints
- `GET /api/notifications/` - List notifications
- `POST /api/notifications/mark-read/` - Mark notifications as read
- `GET /api/notifications/stats/` - Get notification statistics

## Database Models

### User Management
- `User`: Custom user model with role-based access
- `UserProfile`: Extended user profile information
- `Department`: Department organization
- `UserSession`: Session tracking

### Achievements
- `AchievementCategory`: Categories for achievements
- `Achievement`: Student achievements
- `AchievementComment`: Comments on achievements
- `AchievementLike`: Likes on achievements
- `AchievementBadge`: Special achievement badges

### Certificates
- `CertificateCategory`: Certificate categories
- `Certificate`: Student certificates
- `CertificateReview`: Review process
- `CertificateComment`: Comments on certificates
- `CertificateTemplate`: Certificate templates

### Volunteering
- `VolunteeringCategory`: Volunteering categories
- `VolunteeringActivity`: Volunteering activities
- `VolunteeringOpportunity`: Available opportunities
- `VolunteeringApplication`: Applications for opportunities
- `VolunteeringImpact`: Impact tracking

### Reports
- `ReportTemplate`: Report templates
- `Report`: Generated reports
- `ReportSchedule`: Scheduled reports
- `ReportAccess`: Access permissions

### Notifications
- `NotificationType`: Types of notifications
- `Notification`: User notifications
- `NotificationTemplate`: Notification templates
- `NotificationPreference`: User preferences
- `NotificationSubscription`: Delivery subscriptions

## Configuration

### Environment Variables
- `SECRET_KEY`: Django secret key
- `DEBUG`: Debug mode
- `DB_NAME`: Database name
- `DB_USER`: Database user
- `DB_PASSWORD`: Database password
- `DB_HOST`: Database host
- `DB_PORT`: Database port
- `EMAIL_HOST`: Email server host
- `EMAIL_PORT`: Email server port
- `EMAIL_HOST_USER`: Email username
- `EMAIL_HOST_PASSWORD`: Email password
- `CELERY_BROKER_URL`: Celery broker URL
- `CELERY_RESULT_BACKEND`: Celery result backend

### CORS Configuration
The API is configured to accept requests from:
- `http://localhost:3000` (React development server)
- `http://localhost:5173` (Vite development server)

## Testing

### Run Tests
```bash
python manage.py test
```

### Coverage Report
```bash
coverage run --source='.' manage.py test
coverage report
coverage html
```

## Deployment

### Docker Deployment
```bash
docker-compose up -d
```

### Manual Deployment
1. Set up production environment variables
2. Configure web server (Nginx)
3. Set up SSL certificates
4. Configure database backups
5. Set up monitoring and logging

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team.
