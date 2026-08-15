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
where pnpm >nul 2>nul || (echo ERROR: pnpm was not found. Install it with: npm install -g pnpm& pause & exit /b 1)

for /f "delims=" %%v in ('node -v') do echo Node: %%v
for /f "delims=" %%v in ('pnpm -v') do echo pnpm: %%v
echo.

if not exist node_modules\electron\package.json (
  echo [1/5] Installing pinned dependencies from the committed lockfile...
  call pnpm install --frozen-lockfile
  if errorlevel 1 goto :failed
) else (
  echo [1/5] Dependencies already installed.
)

echo.
echo [2/5] Preparing integrated Tor runtime from the official Tor Project bundle...
call pnpm run prepare:tor
if errorlevel 1 goto :failed

echo.
echo [3/5] Validating source, Tor integration, network analysis, and renderer...
call pnpm run check
if errorlevel 1 goto :failed

if exist release rmdir /s /q release

echo.
echo [4/5] Building production renderer...
call pnpm run build
if errorlevel 1 goto :failed

echo.
echo [5/5] Building standard Windows installer...
call pnpm exec electron-builder --win nsis --x64
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
