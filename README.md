# 🎓 Educational Portal - Complete Integration

A comprehensive educational portal system with separate frontend applications for Students, Faculty, and Administrators, all integrated with a Django REST API backend.

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Student Portal │    │  Admin Portal   │    │ Faculty Portal  │
│   (React/Vite)  │    │   (React/Vite)  │    │  (React/Vite)   │
│   Port: 5173    │    │   Port: 3001    │    │   Port: 3002    │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────▼─────────────┐
                    │    Django REST API        │
                    │      (Backend)            │
                    │      Port: 8000           │
                    └───────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 18.0.0
- **Python** >= 3.8.0
- **PostgreSQL** >= 12.0
- **Git**

### One-Command Setup

```bash
# Clone the repository
git clone <repository-url>
cd sihproto

# Run the complete setup
./setup-integration.sh
```

### Manual Setup

1. **Backend Setup**:
   ```bash
   cd backend
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   cp env.example .env
   # Update .env with your database credentials
   python manage.py migrate
   python manage.py createsuperuser
   python manage.py runserver 8000
   ```

2. **Frontend Setup**:
   ```bash
   # Student Frontend
   cd studentfrontend
   npm install
   cp env.example .env
   npm run dev

   # Admin Frontend (in new terminal)
   cd adminfrontend
   npm install
   cp env.example .env
   npm run dev -- --port 3001

   # Faculty Frontend (in new terminal)
   cd facultyfrontend
   npm install
   cp env.example .env
   npm run dev -- --port 3002
   ```

## 🎯 Features

### Student Portal
- ✅ **Authentication & Authorization**
- ✅ **Achievement Management** - Log and track academic achievements
- ✅ **Certificate Upload** - Upload and manage certificates
- ✅ **Volunteering Activities** - Log community service hours
- ✅ **Portfolio Building** - Create professional portfolio
- ✅ **Real-time Dashboard** - View stats and recent activities
- ✅ **Profile Management** - Update personal information

### Admin Portal
- ✅ **User Management** - Manage students, faculty, and admins
- ✅ **Content Verification** - Approve/reject achievements and certificates
- ✅ **Analytics Dashboard** - System-wide statistics and insights
- ✅ **Report Generation** - Generate various reports
- ✅ **System Configuration** - Manage system settings
- ✅ **Notification Management** - Send system-wide notifications

### Faculty Portal
- ✅ **Review System** - Review student submissions
- ✅ **Approval Workflow** - Approve/reject student achievements
- ✅ **Student Management** - View and manage assigned students
- ✅ **Review History** - Track all review activities
- ✅ **Feedback System** - Provide feedback on submissions

## 🔧 Technology Stack

### Frontend
- **React 18** - UI Framework
- **TypeScript** - Type Safety
- **Vite** - Build Tool & Dev Server
- **Tailwind CSS** - Styling
- **Shadcn UI** - Component Library
- **React Query** - Data Fetching & State Management
- **Axios** - HTTP Client
- **React Router** - Client-side Routing
- **Lucide React** - Icons

### Backend
- **Django 4.2** - Web Framework
- **Django REST Framework** - API Framework
- **PostgreSQL** - Database
- **JWT Authentication** - Token-based Auth
- **Celery** - Task Queue
- **Redis** - Cache & Message Broker
- **Pillow** - Image Processing

## 📁 Project Structure

```
sihproto/
├── backend/                 # Django REST API
│   ├── accounts/           # User management
│   ├── achievements/       # Achievement system
│   ├── certificates/       # Certificate management
│   ├── volunteering/       # Volunteering activities
│   ├── reports/           # Report generation
│   ├── notifications/     # Notification system
│   └── eduportal/         # Main Django project
├── studentfrontend/        # Student Portal (React)
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── contexts/     # React contexts
│   │   ├── hooks/        # Custom hooks
│   │   └── lib/          # Utilities & API client
├── adminfrontend/          # Admin Portal (React)
├── facultyfrontend/        # Faculty Portal (React)
├── setup-integration.sh    # Complete setup script
├── test-integration.sh     # Integration test script
└── start-*.sh             # Individual service startup scripts
```

## 🔐 Authentication & Authorization

The system uses JWT (JSON Web Tokens) for authentication:

- **Access Token**: Short-lived (60 minutes) for API requests
- **Refresh Token**: Long-lived (7 days) for token renewal
- **Role-based Access**: Student, Faculty, Admin roles with different permissions

### Default Credentials

- **Admin**: `admin@example.com` / `admin123`
- **Student**: `student@example.com` / `student123`
- **Faculty**: `faculty@example.com` / `faculty123`

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/login/` - User login
- `POST /api/auth/register/` - User registration
- `POST /api/auth/refresh/` - Refresh access token
- `POST /api/auth/logout/` - User logout
- `GET /api/auth/user/` - Get current user

### Achievements
- `GET /api/achievements/` - List achievements
- `POST /api/achievements/` - Create achievement
- `GET /api/achievements/{id}/` - Get achievement details
- `PATCH /api/achievements/{id}/` - Update achievement
- `DELETE /api/achievements/{id}/` - Delete achievement

### Certificates
- `GET /api/certificates/` - List certificates
- `POST /api/certificates/` - Upload certificate
- `GET /api/certificates/{id}/` - Get certificate details
- `PATCH /api/certificates/{id}/` - Update certificate
- `DELETE /api/certificates/{id}/` - Delete certificate

### Volunteering
- `GET /api/volunteering/` - List volunteering activities
- `POST /api/volunteering/` - Log volunteering activity
- `GET /api/volunteering/{id}/` - Get activity details
- `PATCH /api/volunteering/{id}/` - Update activity
- `DELETE /api/volunteering/{id}/` - Delete activity

## 🚀 Development

### Starting All Services

```bash
# Start everything at once
./start-all.sh

# Or start individually
./start-backend.sh    # Django backend
./start-student.sh    # Student frontend
./start-admin.sh      # Admin frontend
./start-faculty.sh    # Faculty frontend
```

### Development Commands

```bash
# Install all frontend dependencies
npm run install:all

# Build all frontends
npm run build:all

# Run integration tests
./test-integration.sh
```

## 🧪 Testing

The project includes comprehensive integration tests:

```bash
# Run all integration tests
./test-integration.sh
```

Tests cover:
- ✅ Service availability
- ✅ API endpoint functionality
- ✅ Frontend builds
- ✅ Environment configuration
- ✅ Database connectivity
- ✅ CORS configuration
- ✅ Authentication flow

## 🔧 Configuration

### Environment Variables

Each frontend has its own `.env` file:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000/api

# App Configuration
VITE_APP_NAME=Portal Name
VITE_APP_VERSION=1.0.0
VITE_NODE_ENV=development
```

Backend `.env`:
```env
# Database
DB_NAME=eduportal
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432

# Security
SECRET_KEY=your-secret-key
DEBUG=True

# CORS
ALLOWED_HOSTS=localhost,127.0.0.1
```

## 📊 Database Schema

### Key Models

- **User**: Custom user model with role-based permissions
- **UserProfile**: Extended user information
- **Achievement**: Student achievements with verification status
- **Certificate**: Uploaded certificates with verification
- **VolunteeringActivity**: Community service activities
- **Notification**: System notifications

## 🚀 Deployment

### Production Setup

1. **Backend Deployment**:
   ```bash
   # Install production dependencies
   pip install gunicorn whitenoise

   # Collect static files
   python manage.py collectstatic

   # Run with Gunicorn
   gunicorn eduportal.wsgi:application
   ```

2. **Frontend Deployment**:
   ```bash
   # Build for production
   npm run build:all

   # Serve with nginx or similar
   ```

### Docker Deployment

```dockerfile
# Example Dockerfile for backend
FROM python:3.11-slim
WORKDIR /app
COPY backend/requirements.txt .
RUN pip install -r requirements.txt
COPY backend/ .
CMD ["gunicorn", "eduportal.wsgi:application"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `./test-integration.sh`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

1. **Port Conflicts**: Ensure ports 8000, 5173, 3001, 3002 are available
2. **Database Connection**: Verify PostgreSQL is running and credentials are correct
3. **CORS Issues**: Check backend CORS settings include all frontend URLs
4. **Authentication**: Verify JWT tokens are being stored and sent correctly
5. **Build Errors**: Ensure all dependencies are installed with `npm install`

### Getting Help

- Check the integration test results: `./test-integration.sh`
- Review the logs in each service terminal
- Verify environment configuration
- Ensure all services are running

## 🎉 Success!

If everything is set up correctly, you should be able to access:

- **Student Portal**: http://localhost:5173
- **Admin Portal**: http://localhost:3001
- **Faculty Portal**: http://localhost:3002
- **Backend API**: http://localhost:8000/api

Login with the default credentials and start exploring the integrated educational portal system!
