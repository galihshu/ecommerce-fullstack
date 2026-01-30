@echo off
echo Starting Development Environment...
echo.

:: Stop existing containers
echo Stopping existing containers...
docker-compose -f docker-compose.dev.yml down

:: Build and start development containers
echo.
echo Building and starting development containers...
docker-compose -f docker-compose.dev.yml up --build -d

:: Check if containers are running
echo.
echo Checking container status...
docker-compose -f docker-compose.dev.yml ps

echo.
echo ✅ Development environment ready!
echo.
echo 🌐 Frontend (Dev): http://localhost:5173
echo 🔧 Backend API: http://localhost:8080
echo 🗄️  Redis: localhost:6379
echo.
echo To view logs: docker-compose -f docker-compose.dev.yml logs -f
echo To stop: docker-compose -f docker-compose.dev.yml down
echo.
pause
