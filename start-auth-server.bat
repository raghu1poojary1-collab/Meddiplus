@echo off
echo ===================================================
echo Starting MediPulse PostgreSQL Auth API Server
echo Connecting to: postgresql://129.159.230.220:8056/Mediplus
echo Endpoint: http://localhost:5002/api/auth
echo ===================================================
cd /d "%~dp0"
python scripts\auth_server.py
pause

