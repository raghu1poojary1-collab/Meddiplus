@echo off
echo ===================================================
echo Starting MediPulse Backend with PostgreSQL
echo Database: Mediplus
echo Host:     129.159.230.220:8056
echo User:     Raghavendra
echo Port:     8080
echo WebSocket: ws://localhost:8080/ws
echo Monitor:   http://localhost:8080/ws-test.html
echo ===================================================
cd /d "%~dp0backend"
call mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=postgres
pause

