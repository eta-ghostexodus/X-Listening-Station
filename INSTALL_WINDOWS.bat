@echo off
setlocal EnableExtensions EnableDelayedExpansion
cd /d "%~dp0"
title CYBERVS DOMINATVS X Listening Station Enterprise v3.4.1 - Windows Installer

echo ==============================================================================
echo   CYBERVS DOMINATVS X LISTENING STATION ENTERPRISE v3.4.1
echo   ONE-CLICK WINDOWS BUILD + INSTALLER
echo ==============================================================================
echo.

if not exist package.json (
  echo ERROR: package.json is missing.
  echo Extract the complete ZIP into a normal folder before running this file.
  pause
  exit /b 1
)
where node >nul 2>nul || (echo ERROR: Node.js was not found.& pause & exit /b 1)
where npm >nul 2>nul || (echo ERROR: npm was not found.& pause & exit /b 1)

for /f "delims=" %%v in ('node -v') do echo Node: %%v
for /f "delims=" %%v in ('npm -v') do echo npm:  %%v
echo.

if not exist node_modules\electron\package.json (
  echo [1/5] Installing pinned dependencies...
  call npm install --no-audit --no-fund
  if errorlevel 1 goto :failed
) else (
  echo [1/5] Dependencies already installed.
)

echo.
echo [2/5] Preparing integrated Tor runtime from the official Tor Project bundle...
call npm run prepare:tor
if errorlevel 1 goto :failed

echo.
echo [3/5] Validating source, Tor integration, network analysis, and renderer...
call npm run check
if errorlevel 1 goto :failed

if exist release rmdir /s /q release

echo.
echo [4/5] Building production renderer...
call npm run build
if errorlevel 1 goto :failed

echo.
echo [5/5] Building standard Windows installer...
call npx electron-builder --win nsis --x64
if errorlevel 1 goto :failed

set "INSTALLER="
for /f "delims=" %%F in ('dir /b /s "release\*Setup*.exe" 2^>nul') do if not defined INSTALLER set "INSTALLER=%%F"
if not defined INSTALLER (
  echo ERROR: Build finished but the Setup executable was not found.
  pause
  exit /b 1
)

echo.
echo ==============================================================================
echo   BUILD COMPLETE
echo ==============================================================================
echo.
echo Integrated Tor: INCLUDED
echo Installer: !INSTALLER!
echo.
echo Opening the finished installer location...
start "" explorer.exe /select,"!INSTALLER!"
pause
exit /b 0

:failed
echo.
echo ==============================================================================
echo   BUILD FAILED
echo ==============================================================================
echo The complete error is shown above.
pause
exit /b 1
