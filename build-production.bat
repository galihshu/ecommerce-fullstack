@echo off
echo Building Production Version...
echo.

:: Navigate to frontend directory
cd /d "%~dp0frontend"

:: Install dependencies if needed
echo Installing dependencies...
call npm install

:: Build production version
echo.
echo Building frontend for production...
call npm run build

:: Check if build was successful
if exist "dist" (
    echo.
    echo ✅ Build successful!
    echo Frontend is ready for production deployment.
    echo.
    echo Build files are located in: frontend\dist\
    echo.
    
    :: Option to serve the build
    set /p serve="Do you want to serve the production build locally? (y/n): "
    if /i "%serve%"=="y" (
        echo.
        echo Starting production server...
        echo The app will be available at: http://localhost:4173
        echo Press Ctrl+C to stop the server.
        echo.
        call npm run preview
    )
) else (
    echo.
    echo ❌ Build failed! Please check the error messages above.
)

echo.
pause
