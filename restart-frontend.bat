@echo off
echo Restarting Frontend Development Server...
echo.

:: Kill existing Node.js processes
echo Stopping existing frontend processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

:: Navigate to frontend directory
cd /d "%~dp0frontend"

:: Start frontend development server
echo Starting frontend development server...
echo The app will be available at: http://localhost:5173
echo.
start "Frontend Dev Server" cmd /k "npm run dev"

echo.
echo Frontend server is restarting...
echo You can close this window after the server starts.
echo.
pause
