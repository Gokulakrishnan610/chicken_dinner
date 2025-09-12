# Frontend-Backend Integration Guide

This project consists of three separate frontend applications (Student, Admin, Faculty) integrated with a Django backend.

## Architecture

- **Backend**: Django REST API (Port 8000)
- **Student Frontend**: React + Vite (Port 5173)
- **Admin Frontend**: React + Vite (Port 3001)
- **Faculty Frontend**: React + Vite (Port 3002)

## Quick Start

### Option 1: Start All Services
```bash
./start-all.sh
```

### Option 2: Start Services Individually

1. **Start Backend**:
   ```bash
   ./start-backend.sh
   ```

2. **Start Student Frontend**:
   ```bash
   ./start-student.sh
   ```

3. **Start Admin Frontend**:
   ```bash
   ./start-admin.sh
   ```

4. **Start Faculty Frontend**:
   ```bash
   ./start-faculty.sh
   ```

## Access Points

- **Backend API**: http://localhost:8000/api/
- **Student Portal**: http://localhost:5173
- **Admin Portal**: http://localhost:3001
- **Faculty Portal**: http://localhost:3002

## Default Credentials

- **Admin**: admin@example.com / admin123
- **Student**: student@example.com / student123
- **Faculty**: faculty@example.com / faculty123

## API Integration Features

### Student Frontend
- ✅ Authentication (Login/Register)
- ✅ Achievement Management
- ✅ Certificate Upload
- ✅ Volunteering Activity Logging
- ✅ Profile Management
- ✅ Real-time Data from Backend

### Admin Frontend
- ✅ User Management
- ✅ Achievement Verification
- ✅ Certificate Verification
- ✅ Volunteering Activity Verification
- ✅ Dashboard Analytics
- ✅ Report Generation

### Faculty Frontend
- ✅ Review Pending Submissions
- ✅ Approve/Reject Achievements
- ✅ Approve/Reject Certificates
- ✅ Approve/Reject Volunteering Activities
- ✅ Review History

## Environment Configuration

Each frontend has its own `.env` file:
- `studentfrontend/.env`
- `adminfrontend/.env`
- `facultyfrontend/.env`

Key environment variables:
```
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME=Portal Name
VITE_APP_VERSION=1.0.0
```

## Development

### Backend Development
```bash
cd backend
source venv/bin/activate
python manage.py runserver 8000
```

### Frontend Development
```bash
# Student Frontend
cd studentfrontend
npm run dev

# Admin Frontend
cd adminfrontend
npm run dev -- --port 3001

# Faculty Frontend
cd facultyfrontend
npm run dev -- --port 3002
```

## Database

The backend uses PostgreSQL by default. Update the database configuration in `backend/.env`:

```env
DB_NAME=eduportal
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
```

## Troubleshooting

1. **Port Conflicts**: Make sure ports 8000, 5173, 3001, and 3002 are available
2. **Database Issues**: Ensure PostgreSQL is running and credentials are correct
3. **CORS Issues**: Check that the backend CORS settings include all frontend URLs
4. **Authentication Issues**: Verify that JWT tokens are being stored and sent correctly

## API Documentation

The backend provides a browsable API at http://localhost:8000/api/ when running.

Key endpoints:
- `/api/auth/` - Authentication
- `/api/achievements/` - Achievement management
- `/api/certificates/` - Certificate management
- `/api/volunteering/` - Volunteering activities
- `/api/accounts/` - User management
- `/api/notifications/` - Notifications
- `/api/reports/` - Report generation
