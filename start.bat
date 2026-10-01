@echo off
echo ===================================================
echo Starting MediPulse (Frontend + Backend)
echo ===================================================
start "MediPulse Frontend" cmd /c "%~dp0start-frontend.bat"
start "MediPulse Backend" cmd /c "%~dp0start-backend.bat"
echo Services launched:
echo - Frontend: http://localhost:3000
echo - Backend:  http://localhost:8080
echo ===================================================
