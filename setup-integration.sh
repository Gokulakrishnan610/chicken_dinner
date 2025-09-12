#!/bin/bash

# Frontend-Backend Integration Setup Script
# This script sets up the complete integration between all three frontends and the Django backend

echo "🚀 Starting Frontend-Backend Integration Setup..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -d "backend" ] || [ ! -d "studentfrontend" ] || [ ! -d "adminfrontend" ] || [ ! -d "facultyfrontend" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

# 1. Backend Setup
print_status "Setting up Django backend..."

cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    print_status "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
print_status "Activating virtual environment..."
source venv/bin/activate

# Install Python dependencies
print_status "Installing Python dependencies..."
pip install -r requirements.txt

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    print_status "Creating .env file from template..."
    cp env.example .env
    print_warning "Please update the .env file with your database credentials and other settings"
fi

# Run database migrations
print_status "Running database migrations..."
python manage.py makemigrations
python manage.py migrate

# Create superuser (optional)
print_status "Creating superuser account..."
echo "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.create_superuser('admin', 'admin@example.com', 'admin123') if not User.objects.filter(email='admin@example.com').exists() else None" | python manage.py shell

# Load initial data
print_status "Loading initial data..."
python manage.py loaddata fixtures/initial_data.json

print_success "Backend setup completed!"

cd ..

# 2. Frontend Setup
print_status "Setting up frontend applications..."

# Student Frontend
print_status "Setting up Student Frontend..."
cd studentfrontend

# Install dependencies
if [ ! -d "node_modules" ]; then
    print_status "Installing student frontend dependencies..."
    npm install
fi

# Create .env file
if [ ! -f ".env" ]; then
    print_status "Creating student frontend .env file..."
    cp env.example .env
fi

cd ..

# Admin Frontend
print_status "Setting up Admin Frontend..."
cd adminfrontend

# Install dependencies
if [ ! -d "node_modules" ]; then
    print_status "Installing admin frontend dependencies..."
    npm install
fi

# Create .env file
if [ ! -f ".env" ]; then
    print_status "Creating admin frontend .env file..."
    cp env.example .env
fi

cd ..

# Faculty Frontend
print_status "Setting up Faculty Frontend..."
cd facultyfrontend

# Install dependencies
if [ ! -d "node_modules" ]; then
    print_status "Installing faculty frontend dependencies..."
    npm install
fi

# Create .env file
if [ ! -f ".env" ]; then
    print_status "Creating faculty frontend .env file..."
    cp env.example .env
fi

cd ..

print_success "Frontend setup completed!"

# 3. Create startup scripts
print_status "Creating startup scripts..."

# Backend startup script
cat > start-backend.sh << 'EOF'
#!/bin/bash
cd backend
source venv/bin/activate
python manage.py runserver 8000
EOF

chmod +x start-backend.sh

# Student frontend startup script
cat > start-student.sh << 'EOF'
#!/bin/bash
cd studentfrontend
npm run dev
EOF

chmod +x start-student.sh

# Admin frontend startup script
cat > start-admin.sh << 'EOF'
#!/bin/bash
cd adminfrontend
npm run dev -- --port 3001
EOF

chmod +x start-admin.sh

# Faculty frontend startup script
cat > start-faculty.sh << 'EOF'
#!/bin/bash
cd facultyfrontend
npm run dev -- --port 3002
EOF

chmod +x start-faculty.sh

# All services startup script
cat > start-all.sh << 'EOF'
#!/bin/bash

# Function to kill background processes on exit
cleanup() {
    echo "Stopping all services..."
    kill $(jobs -p) 2>/dev/null
    exit
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

echo "Starting all services..."

# Start backend
echo "Starting Django backend on port 8000..."
cd backend && source venv/bin/activate && python manage.py runserver 8000 &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontends
echo "Starting Student Frontend on port 5173..."
cd ../studentfrontend && npm run dev &
STUDENT_PID=$!

echo "Starting Admin Frontend on port 3001..."
cd ../adminfrontend && npm run dev -- --port 3001 &
ADMIN_PID=$!

echo "Starting Faculty Frontend on port 3002..."
cd ../facultyfrontend && npm run dev -- --port 3002 &
FACULTY_PID=$!

echo ""
echo "All services started!"
echo "Backend: http://localhost:8000"
echo "Student Frontend: http://localhost:5173"
echo "Admin Frontend: http://localhost:3001"
echo "Faculty Frontend: http://localhost:3002"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for all background processes
wait
EOF

chmod +x start-all.sh

print_success "Startup scripts created!"

# 4. Create README for integration
cat > INTEGRATION_README.md << 'EOF'
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
EOF

print_success "Integration documentation created!"

# 5. Final Summary
echo ""
print_success "🎉 Integration setup completed successfully!"
echo ""
print_status "Next steps:"
echo "1. Update database credentials in backend/.env"
echo "2. Run './start-all.sh' to start all services"
echo "3. Access the applications at:"
echo "   - Student Portal: http://localhost:5173"
echo "   - Admin Portal: http://localhost:3001"
echo "   - Faculty Portal: http://localhost:3002"
echo "   - Backend API: http://localhost:8000/api"
echo ""
print_status "Default admin credentials: admin@example.com / admin123"
echo ""
print_warning "Make sure PostgreSQL is running before starting the backend!"
echo ""
