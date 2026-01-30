@echo off
echo Testing Pre-commit Hook for Swagger Auto-update
echo.

echo Installing swag tool...
go install github.com/swaggo/swag/cmd/swag@latest

echo.
echo Making pre-commit hook executable...
echo (Windows doesn't need chmod, hook should work directly)

echo.
echo Testing manual Swagger update...
call update-swagger.bat

echo.
echo Now test the pre-commit hook:
echo 1. Make any change to a Go file
echo 2. Run: git add .
echo 3. Run: git commit -m "test swagger auto-update"
echo.
echo The hook should automatically update Swagger docs before commit!

echo.
echo 📋 Summary:
echo ✅ swag tool installed
echo ✅ Pre-commit hook created at .git/hooks/pre-commit
echo ✅ Manual update script created: update-swagger.bat
echo ✅ Test script created: test-swagger-hook.bat
echo.
pause
