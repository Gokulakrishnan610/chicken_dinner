# Start All Development Servers
# This script starts the backend and all frontend applications

Write-Host "🚀 Starting Education Portal Development Environment..." -ForegroundColor Green

# Function to check if a port is in use
function Test-Port {
    param([int]$Port)
    try {
        $connection = New-Object System.Net.Sockets.TcpClient
        $connection.Connect("localhost", $Port)
        $connection.Close()
        return $true
    }
    catch {
        return $false
    }
}

# Check if required ports are available
Write-Host "🔍 Checking port availability..." -ForegroundColor Yellow
$ports = @(8000, 3000, 3001, 3002)
foreach ($port in $ports) {
    if (Test-Port -Port $port) {
        Write-Host "⚠️  Port $port is already in use. Please stop the service using this port first." -ForegroundColor Red
        exit 1
    }
}

# Start Backend
Write-Host "🐍 Starting Django Backend on port 8000..." -ForegroundColor Cyan
Set-Location backend

if (-not (Test-Path "venv")) {
    Write-Host "📦 Creating Python virtual environment..." -ForegroundColor Yellow
    python -m venv venv
}

& ".\venv\Scripts\Activate.ps1"
pip install -r requirements.txt

# Run migrations
Write-Host "🗄️  Running database migrations..." -ForegroundColor Yellow
python manage.py migrate

# Load initial data
Write-Host "📊 Loading initial data..." -ForegroundColor Yellow
python scripts/setup_initial_data.py

# Start Django server in background
$backendJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    & ".\venv\Scripts\Activate.ps1"
    python manage.py runserver 8000
}

Set-Location ..

# Wait a moment for backend to start
Start-Sleep -Seconds 3

# Start Student Frontend
Write-Host "🎓 Starting Student Frontend on port 3000..." -ForegroundColor Cyan
Set-Location studentfrontend
npm install
$studentJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    npm run dev
}
Set-Location ..

# Start Faculty Frontend
Write-Host "👨‍🏫 Starting Faculty Frontend on port 3001..." -ForegroundColor Cyan
Set-Location facultyfrontend
npm install
$facultyJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    npm run dev
}
Set-Location ..

# Start Admin Frontend
Write-Host "👨‍💼 Starting Admin Frontend on port 3002..." -ForegroundColor Cyan
Set-Location adminfrontend
npm install
$adminJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    npm run dev
}
Set-Location ..

Write-Host ""
Write-Host "✅ All servers started successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Access the applications:" -ForegroundColor Yellow
Write-Host "   Student Portal: http://localhost:3000" -ForegroundColor White
Write-Host "   Faculty Portal: http://localhost:3001" -ForegroundColor White
Write-Host "   Admin Portal:  http://localhost:3002" -ForegroundColor White
Write-Host "   Backend API:   http://localhost:8000" -ForegroundColor White
Write-Host ""
Write-Host "📝 Sample login credentials:" -ForegroundColor Yellow
Write-Host "   Admin: admin@eduportal.com / admin123" -ForegroundColor White
Write-Host "   Faculty: faculty1@eduportal.com / faculty123" -ForegroundColor White
Write-Host "   Student: student1@eduportal.com / student123" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop all servers" -ForegroundColor Red

# Function to cleanup on exit
function Stop-AllServers {
    Write-Host ""
    Write-Host "🛑 Stopping all servers..." -ForegroundColor Yellow
    Stop-Job $backendJob -ErrorAction SilentlyContinue
    Stop-Job $studentJob -ErrorAction SilentlyContinue
    Stop-Job $facultyJob -ErrorAction SilentlyContinue
    Stop-Job $adminJob -ErrorAction SilentlyContinue
    Remove-Job $backendJob -ErrorAction SilentlyContinue
    Remove-Job $studentJob -ErrorAction SilentlyContinue
    Remove-Job $facultyJob -ErrorAction SilentlyContinue
    Remove-Job $adminJob -ErrorAction SilentlyContinue
    Write-Host "✅ All servers stopped." -ForegroundColor Green
    exit 0
}

# Set trap to cleanup on script exit
Register-EngineEvent -SourceIdentifier PowerShell.Exiting -Action { Stop-AllServers }

# Wait for user input
try {
    while ($true) {
        Start-Sleep -Seconds 1
    }
}
catch {
    Stop-AllServers
}
