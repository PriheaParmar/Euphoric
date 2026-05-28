@echo off
setlocal EnableExtensions EnableDelayedExpansion
cd /d "%~dp0"

set "HOST=com.euphoric.butterfly"
set "EXT_ID=njcdlgdmehakdnbhflchddglcdecljho"
set "ROOT=%~dp0"
set "LAUNCHER=%ROOT%native-host.cmd"
set "MANIFEST=%ROOT%com.euphoric.butterfly.json"
set "LOG=%ROOT%euphoric_v6_repair_install_log.txt"

echo Euphoric v6.6 Alarm Engine Repair Installer > "%LOG%"
echo Folder: %ROOT% >> "%LOG%"
echo Extension ID: %EXT_ID% >> "%LOG%"
echo.
echo Euphoric v6.6 Alarm Engine Repair Installer
echo ----------------------------------------
echo This will repair the Chrome-to-butterfly connection and alarm engine.
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo ERROR: Node.js is not installed or not in PATH.
  echo Install Node.js from nodejs.org, reopen this folder, then run this installer again.
  echo Node.js missing >> "%LOG%"
  pause
  exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
  echo ERROR: npm is not installed or not in PATH.
  echo npm missing >> "%LOG%"
  pause
  exit /b 1
)

if not exist "%ROOT%node_modules\electron" (
  echo Installing Electron dependency. This can take a minute...
  echo Running npm install >> "%LOG%"
  call npm install >> "%LOG%" 2>&1
  if errorlevel 1 (
    echo ERROR: npm install failed. Send me this log:
    echo %LOG%
    pause
    exit /b 1
  )
)

if not exist "%LAUNCHER%" (
  echo ERROR: native-host.cmd is missing.
  echo Missing launcher: %LAUNCHER% >> "%LOG%"
  pause
  exit /b 1
)

echo Removing old/broken native host registry entries... >> "%LOG%"
reg delete "HKCU\Software\Google\Chrome\NativeMessagingHosts\%HOST%" /f >> "%LOG%" 2>&1
reg delete "HKCU\Software\Chromium\NativeMessagingHosts\%HOST%" /f >> "%LOG%" 2>&1
reg delete "HKCU\Software\Microsoft\Edge\NativeMessagingHosts\%HOST%" /f >> "%LOG%" 2>&1
reg delete "HKCU\Software\Wow6432Node\Google\Chrome\NativeMessagingHosts\%HOST%" /f >> "%LOG%" 2>&1
reg delete "HKCU\Software\Wow6432Node\Chromium\NativeMessagingHosts\%HOST%" /f >> "%LOG%" 2>&1
reg delete "HKCU\Software\Wow6432Node\Microsoft\Edge\NativeMessagingHosts\%HOST%" /f >> "%LOG%" 2>&1

set "PATHJSON=%LAUNCHER:\=\\%"
> "%MANIFEST%" echo {
>> "%MANIFEST%" echo   "name": "%HOST%",
>> "%MANIFEST%" echo   "description": "Euphoric v6.6 Alarm Engine Native Companion",
>> "%MANIFEST%" echo   "path": "%PATHJSON%",
>> "%MANIFEST%" echo   "type": "stdio",
>> "%MANIFEST%" echo   "allowed_origins": [
>> "%MANIFEST%" echo     "chrome-extension://%EXT_ID%/"
>> "%MANIFEST%" echo   ]
>> "%MANIFEST%" echo }

reg add "HKCU\Software\Google\Chrome\NativeMessagingHosts\%HOST%" /ve /t REG_SZ /d "%MANIFEST%" /f >> "%LOG%" 2>&1
reg add "HKCU\Software\Chromium\NativeMessagingHosts\%HOST%" /ve /t REG_SZ /d "%MANIFEST%" /f >> "%LOG%" 2>&1
reg add "HKCU\Software\Microsoft\Edge\NativeMessagingHosts\%HOST%" /ve /t REG_SZ /d "%MANIFEST%" /f >> "%LOG%" 2>&1
reg add "HKCU\Software\Wow6432Node\Google\Chrome\NativeMessagingHosts\%HOST%" /ve /t REG_SZ /d "%MANIFEST%" /f >> "%LOG%" 2>&1
reg add "HKCU\Software\Wow6432Node\Chromium\NativeMessagingHosts\%HOST%" /ve /t REG_SZ /d "%MANIFEST%" /f >> "%LOG%" 2>&1
reg add "HKCU\Software\Wow6432Node\Microsoft\Edge\NativeMessagingHosts\%HOST%" /ve /t REG_SZ /d "%MANIFEST%" /f >> "%LOG%" 2>&1

echo.
echo Repair installed successfully.
echo Host: %HOST%
echo Manifest: %MANIFEST%
echo Allowed extension ID: %EXT_ID%
echo.
echo IMPORTANT: Close ALL Chrome windows completely.
echo Then reopen Chrome and click Euphoric ^> Tasks ^> Test logo butterfly.
echo.
echo Log saved: %LOG%
pause
