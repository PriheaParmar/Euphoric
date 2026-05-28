@echo off
setlocal
cd /d "%~dp0"
echo Euphoric v4.2 Direct Logo Butterfly Test
echo ------------------------------------------
echo This does NOT use Chrome.
echo The Euphoric logo butterfly should fly in at top-right.
echo Click it to open the compact note.
echo.
where node >nul 2>nul
if errorlevel 1 (
  echo ERROR: Node.js is not installed or not in PATH.
  pause
  exit /b 1
)
if not exist "%~dp0node_modules\electron" (
  echo Installing Electron dependency first...
  call npm install
  if errorlevel 1 (
    echo npm install failed.
    pause
    exit /b 1
  )
)
node "%~dp0native-host.js" --test
pause
