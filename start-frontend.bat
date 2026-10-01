@echo off
echo ===================================================
echo Starting MediPulse Frontend (HTTP Server)
echo ===================================================
echo Serving on http://localhost:3000
echo - Patient Interface: http://localhost:3000/index.html
echo - Admin Interface:   http://localhost:3000/admin.html
echo ===================================================
python -m http.server 3000
pause
