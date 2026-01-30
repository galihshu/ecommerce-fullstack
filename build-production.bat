@echo off
echo Building Production Version with Docker...
echo.

:: Stop existing containers
echo Stopping existing containers...
docker-compose -f docker-compose.prod.yml down

:: Build and start production containers
echo.
echo Building and starting production containers...
docker-compose -f docker-compose.prod.yml up --build -d

:: Check if containers are running
echo.
echo Checking container status...
docker-compose -f docker-compose.prod.yml ps

echo.
echo ✅ Production build complete!
echo.
echo 🌐 Frontend: http://localhost:80
echo 🔧 Backend API: http://localhost:8080
echo 🗄️  Redis: localhost:6379
echo.
echo To view logs: docker-compose -f docker-compose.prod.yml logs -f
echo To stop: docker-compose -f docker-compose.prod.yml down
echo.
pause
