@echo off
echo Starting CRUD Application...
echo.

echo Starting Backend Server...
start "Backend" cmd /k "cd mycontacts-backend && npm run dev"

timeout /t 3 /nobreak > nul

echo Starting Frontend Server...
start "Frontend" cmd /k "cd mycontact-frontend && npm run dev"

echo.
echo Both servers are starting...
echo Backend: http://localhost:5001
echo Frontend: http://localhost:3000
echo.
pause