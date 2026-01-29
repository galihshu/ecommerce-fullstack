@echo off
echo Restarting All Servers (Backend + Frontend)...
echo.

:: Kill existing processes
echo Stopping existing servers...
taskkill /F /IM go.exe 2>nul
taskkill /F /IM main.exe 2>nul
taskkill /F /IM node.exe 2>nul
timeout /t 3 /nobreak >nul

:: Start Backend
echo.
echo Starting Backend Server...
cd /d "%~dp0backend"
start "Backend Server" cmd /k "go run main.go"

:: Wait a moment for backend to start
timeout /t 3 /nobreak >nul

:: Start Frontend
echo.
echo Starting Frontend Development Server...
cd /d "%~dp0frontend"
start "Frontend Dev Server" cmd /k "npm run dev"

echo.
echo ✅ Both servers are restarting...
echo.
echo Backend: http://localhost:8080
echo Frontend: http://localhost:5173
echo.
echo You can close this window after both servers start.
echo.
pause
