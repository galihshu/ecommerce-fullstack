@echo off
echo Updating Swagger documentation...
echo.

cd backend

echo Running swag init...
swag init

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Swagger documentation updated successfully!
    echo 📄 Files generated:
    echo    - docs/docs.go
    echo    - docs/swagger.json  
    echo    - docs/swagger.yaml
    echo.
    echo 🌐 Access at: http://localhost:8080/swagger/index.html
) else (
    echo.
    echo ❌ Failed to update Swagger documentation
    echo Please check the error messages above
)

cd ..
echo.
pause
