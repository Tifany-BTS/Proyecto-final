@echo off
call pnpm build
if errorlevel 1 exit /b 1
exit /b 0
