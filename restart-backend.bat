@echo off
echo Restarting Backend Server...
echo.

:: Kill existing Go processes
echo Stopping existing backend processes...
taskkill /F /IM go.exe 2>nul
taskkill /F /IM main.exe 2>nul
timeout /t 2 /nobreak >nul

:: Navigate to backend directory
cd /d "%~dp0backend"

:: Start backend server
echo Starting backend server...
start "Backend Server" cmd /k "go run main.go"

echo.
echo Backend server is restarting...
echo You can close this window after the server starts.
echo.
pause
