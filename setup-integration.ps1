# Frontend-Backend Integration Setup Script for Windows PowerShell
# This script sets up the complete integration between all three frontends and the Django backend

Write-Host "🚀 Starting Frontend-Backend Integration Setup..." -ForegroundColor Blue

# Function to print colored output
function Write-Status {
    param($Message)
    Write-Host "[INFO] $Message" -ForegroundColor Blue
}

function Write-Success {
    param($Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor Green
}

function Write-Warning {
    param($Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param($Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

# Check if we're in the right directory
if (-not (Test-Path "backend") -or -not (Test-Path "studentfrontend") -or -not (Test-Path "adminfrontend") -or -not (Test-Path "facultyfrontend")) {
    Write-Error "Please run this script from the project root directory"
    exit 1
}

# 1. Backend Setup
Write-Status "Setting up Django backend..."

Set-Location backend

# Create virtual environment if it doesn't exist
if (-not (Test-Path "venv")) {
    Write-Status "Creating Python virtual environment..."
    python -m venv venv
}

# Install Python dependencies
Write-Status "Installing Python dependencies..."
.\venv\Scripts\python.exe -m pip install -r requirements.txt

# Create .env file if it doesn't exist
if (-not (Test-Path ".env")) {
    Write-Status "Creating .env file from template..."
    Copy-Item env.example .env
    Write-Warning "Please update the .env file with your database credentials and other settings"
}

# Run database migrations
Write-Status "Running database migrations..."
.\venv\Scripts\python.exe manage.py makemigrations
.\venv\Scripts\python.exe manage.py migrate

# Create superuser (optional)
Write-Status "Creating superuser account..."
$createSuperuserScript = @"
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(email='admin@example.com').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
"@
$createSuperuserScript | .\venv\Scripts\python.exe manage.py shell

# Load initial data
Write-Status "Loading initial data..."
.\venv\Scripts\python.exe manage.py loaddata fixtures/initial_data.json

Write-Success "Backend setup completed!"

Set-Location ..

# 2. Frontend Setup
Write-Status "Setting up frontend applications..."

# Student Frontend
Write-Status "Setting up Student Frontend..."
Set-Location studentfrontend

# Install dependencies
if (-not (Test-Path "node_modules")) {
    Write-Status "Installing student frontend dependencies..."
    npm install
}

# Create .env file
if (-not (Test-Path ".env")) {
    Write-Status "Creating student frontend .env file..."
    Copy-Item env.example .env
}

Set-Location ..

# Admin Frontend
Write-Status "Setting up Admin Frontend..."
Set-Location adminfrontend

# Install dependencies
if (-not (Test-Path "node_modules")) {
    Write-Status "Installing admin frontend dependencies..."
    npm install
}

# Create .env file
if (-not (Test-Path ".env")) {
    Write-Status "Creating admin frontend .env file..."
    Copy-Item env.example .env
}

Set-Location ..

# Faculty Frontend
Write-Status "Setting up Faculty Frontend..."
Set-Location facultyfrontend

# Install dependencies
if (-not (Test-Path "node_modules")) {
    Write-Status "Installing faculty frontend dependencies..."
    npm install
}

# Create .env file
if (-not (Test-Path ".env")) {
    Write-Status "Creating faculty frontend .env file..."
    Copy-Item env.example .env
}

Set-Location ..

Write-Success "Frontend setup completed!"

# 3. Create startup scripts
Write-Status "Creating startup scripts..."

# Backend startup script
@"
# Backend Startup Script
Set-Location backend
.\venv\Scripts\python.exe manage.py runserver 8000
"@ | Out-File -FilePath "start-backend.ps1" -Encoding UTF8

# Student frontend startup script
@"
# Student Frontend Startup Script
Set-Location studentfrontend
npm run dev
"@ | Out-File -FilePath "start-student.ps1" -Encoding UTF8

# Admin frontend startup script
@"
# Admin Frontend Startup Script
Set-Location adminfrontend
npm run dev -- --port 3001
"@ | Out-File -FilePath "start-admin.ps1" -Encoding UTF8

# Faculty frontend startup script
@"
# Faculty Frontend Startup Script
Set-Location facultyfrontend
npm run dev -- --port 3002
"@ | Out-File -FilePath "start-faculty.ps1" -Encoding UTF8

# All services startup script
@"
# All Services Startup Script
Write-Host "Starting all services..." -ForegroundColor Green

# Start backend
Write-Host "Starting Django backend on port 8000..." -ForegroundColor Blue
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location backend; .\venv\Scripts\python.exe manage.py runserver 8000"

# Wait a moment for backend to start
Start-Sleep -Seconds 3

# Start frontends
Write-Host "Starting Student Frontend on port 5173..." -ForegroundColor Blue
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location studentfrontend; npm run dev"

Write-Host "Starting Admin Frontend on port 3001..." -ForegroundColor Blue
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location adminfrontend; npm run dev -- --port 3001"

Write-Host "Starting Faculty Frontend on port 3002..." -ForegroundColor Blue
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location facultyfrontend; npm run dev -- --port 3002"

Write-Host ""
Write-Host "All services started!" -ForegroundColor Green
Write-Host "Backend: http://localhost:8000" -ForegroundColor Cyan
Write-Host "Student Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "Admin Frontend: http://localhost:3001" -ForegroundColor Cyan
Write-Host "Faculty Frontend: http://localhost:3002" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
"@ | Out-File -FilePath "start-all.ps1" -Encoding UTF8

Write-Success "Startup scripts created!"

# 4. Final Summary
Write-Host ""
Write-Success "🎉 Integration setup completed successfully!"
Write-Host ""
Write-Status "Next steps:"
Write-Host "1. Update database credentials in backend/.env"
Write-Host "2. Run '.\start-all.ps1' to start all services"
Write-Host "3. Access the applications at:"
Write-Host "   - Student Portal: http://localhost:5173"
Write-Host "   - Admin Portal: http://localhost:3001"
Write-Host "   - Faculty Portal: http://localhost:3002"
Write-Host "   - Backend API: http://localhost:8000/api"
Write-Host ""
Write-Status "Default admin credentials: admin@example.com / admin123"
Write-Host ""
Write-Warning "Make sure PostgreSQL is running before starting the backend!"
Write-Host ""
