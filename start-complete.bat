@echo off
echo ========================================
echo   E-Commerce Full Stack Start
echo ========================================
echo.

REM Get current directory
set "PROJECT_DIR=%~dp0"
set "PROJECT_DIR=%PROJECT_DIR:~0,-1%"

echo Project Directory: %PROJECT_DIR%
echo.

REM Check if Go is installed
where go >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Go is not installed or not in PATH
    echo Please install Go from https://golang.org/dl/
    pause
    exit /b 1
)

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Starting Backend Server...
start "Backend Server" cmd /k "cd /d "%PROJECT_DIR%\backend" && go run main.go"

echo.
echo Waiting for backend to initialize (15 seconds)...
timeout /t 15 /nobreak >nul

echo.
echo Starting Frontend...
start "Frontend" cmd /k "cd /d "%PROJECT_DIR%\frontend" && npm run dev"

echo.
echo ========================================
echo Services are starting...
echo.
echo Backend API: http://localhost:8080
echo Frontend App: http://localhost:5173
echo Health Check: http://localhost:8080/health
echo API Docs: http://localhost:8080/swagger/index.html
echo.
echo ========================================
echo Both services starting in separate windows...
echo Please wait a moment for them to fully initialize
echo.

pause
