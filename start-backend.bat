@echo off
echo ===================================================
echo Starting MediPulse Spring Boot Real-Time Backend
echo ===================================================
echo Profile: test (H2 in-memory DB + Seed Data)
echo Port:    8080
echo WebSocket: ws://localhost:8080/ws
echo Monitor:   http://localhost:8080/ws-test.html
echo ===================================================
cd /d "%~dp0backend"
call mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=test
pause
