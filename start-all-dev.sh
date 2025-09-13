#!/bin/bash

# Start All Development Servers
# This script starts the backend and all frontend applications

echo "🚀 Starting Education Portal Development Environment..."

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "⚠️  Port $1 is already in use. Please stop the service using this port first."
        return 1
    else
        return 0
    fi
}

# Check if required ports are available
echo "🔍 Checking port availability..."
check_port 8000 || exit 1
check_port 3000 || exit 1
check_port 3001 || exit 1
check_port 3002 || exit 1

# Start Backend
echo "🐍 Starting Django Backend on port 8000..."
cd backend
if [ ! -d "venv" ]; then
    echo "📦 Creating Python virtual environment..."
    python -m venv venv
fi

source venv/bin/activate
pip install -r requirements.txt

# Run migrations
echo "🗄️  Running database migrations..."
python manage.py migrate

# Load initial data
echo "📊 Loading initial data..."
python scripts/setup_initial_data.py

# Start Django server in background
python manage.py runserver 8000 &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Start Student Frontend
echo "🎓 Starting Student Frontend on port 3000..."
cd studentfrontend
npm install
npm run dev &
STUDENT_PID=$!
cd ..

# Start Faculty Frontend
echo "👨‍🏫 Starting Faculty Frontend on port 3001..."
cd facultyfrontend
npm install
npm run dev &
FACULTY_PID=$!
cd ..

# Start Admin Frontend
echo "👨‍💼 Starting Admin Frontend on port 3002..."
cd adminfrontend
npm install
npm run dev &
ADMIN_PID=$!
cd ..

echo ""
echo "✅ All servers started successfully!"
echo ""
echo "🌐 Access the applications:"
echo "   Student Portal: http://localhost:3000"
echo "   Faculty Portal: http://localhost:3001"
echo "   Admin Portal:  http://localhost:3002"
echo "   Backend API:   http://localhost:8000"
echo ""
echo "📝 Sample login credentials:"
echo "   Admin: admin@eduportal.com / admin123"
echo "   Faculty: faculty1@eduportal.com / faculty123"
echo "   Student: student1@eduportal.com / student123"
echo ""
echo "Press Ctrl+C to stop all servers"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping all servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $STUDENT_PID 2>/dev/null
    kill $FACULTY_PID 2>/dev/null
    kill $ADMIN_PID 2>/dev/null
    echo "✅ All servers stopped."
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for any process to exit
wait
