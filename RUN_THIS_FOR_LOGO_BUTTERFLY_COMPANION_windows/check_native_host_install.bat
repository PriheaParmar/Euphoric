@echo off
setlocal
cd /d "%~dp0"
set "HOST=com.euphoric.butterfly"
set "LOG=%~dp0euphoric_v6_repair_check_log.txt"
echo Euphoric v6.4 native host check > "%LOG%"
echo.
echo Checking Chrome native host registry...
reg query "HKCU\Software\Google\Chrome\NativeMessagingHosts\%HOST%" /ve
reg query "HKCU\Software\Google\Chrome\NativeMessagingHosts\%HOST%" /ve >> "%LOG%" 2>&1
echo.
echo Manifest file:
if exist "%~dp0com.euphoric.butterfly.json" (
  type "%~dp0com.euphoric.butterfly.json"
  type "%~dp0com.euphoric.butterfly.json" >> "%LOG%"
) else (
  echo MISSING manifest in this folder
  echo MISSING manifest in this folder >> "%LOG%"
)
echo.
echo Direct companion test starts now after this check.
echo If the butterfly appears, the companion works.
echo.
call "%~dp0test_companion_direct.bat"
echo.
echo Log saved: %LOG%
pause
