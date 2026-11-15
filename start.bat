@echo off
echo ===================================================
echo Starting MediPulse (Frontend + Backend + Database)
echo ===================================================
start "MediPulse Frontend" cmd /c "%~dp0start-frontend.bat"
start "MediPulse Backend" cmd /c "%~dp0start-backend.bat"
start "MediPulse PostgreSQL Auth Server" cmd /c "%~dp0start-auth-server.bat"
echo Services launched:
echo - Frontend:    http://localhost:3000
echo - Backend:     http://localhost:8080
echo - Auth Server: http://localhost:5002 (PostgreSQL)
echo ===================================================
