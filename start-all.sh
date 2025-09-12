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
