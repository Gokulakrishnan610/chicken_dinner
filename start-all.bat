@echo off
setlocal enabledelayedexpansion

echo Installing packages and starting all services...

REM Setup and start backend
echo Setting up Django backend...
cd backend

REM Check if virtual environment exists, create if not
if not exist "venv\" (
    echo Creating virtual environment...
    python -m venv venv
)

call venv\Scripts\activate.bat

REM Install backend dependencies
echo Installing Python dependencies...
pip install -r requirements.txt

echo Starting Django backend on port 8000...
start /b python manage.py runserver 8000
set BACKEND_PID=!ERRORLEVEL!

REM Wait a moment for backend to start
timeout /t 3 /nobreak > nul

REM Setup and start frontends
echo Setting up Student Frontend...
cd ..\studentfrontend
echo Installing npm dependencies for Student Frontend...
npm install
echo Starting Student Frontend on port 5173...
start /b npm run dev

echo Setting up Admin Frontend...
cd ..\adminfrontend
echo Installing npm dependencies for Admin Frontend...
npm install
echo Starting Admin Frontend on port 3001...
start /b npm run dev -- --port 3001

echo Setting up Faculty Frontend...
cd ..\facultyfrontend
echo Installing npm dependencies for Faculty Frontend...
npm install
echo Starting Faculty Frontend on port 3002...
start /b npm run dev -- --port 3002

echo.
echo All services started!
echo Backend: http://localhost:8000
echo Student Frontend: http://localhost:5173
echo Admin Frontend: http://localhost:3001
echo Faculty Frontend: http://localhost:3002
echo.
echo Press Ctrl+C to stop all services

REM Keep the batch file running
pause