@echo off
setlocal
set "HOST=com.euphoric.butterfly"
reg delete "HKCU\Software\Google\Chrome\NativeMessagingHosts\%HOST%" /f >nul 2>nul
reg delete "HKCU\Software\Chromium\NativeMessagingHosts\%HOST%" /f >nul 2>nul
reg delete "HKCU\Software\Microsoft\Edge\NativeMessagingHosts\%HOST%" /f >nul 2>nul
reg delete "HKCU\Software\Wow6432Node\Google\Chrome\NativeMessagingHosts\%HOST%" /f >nul 2>nul
reg delete "HKCU\Software\Wow6432Node\Chromium\NativeMessagingHosts\%HOST%" /f >nul 2>nul
reg delete "HKCU\Software\Wow6432Node\Microsoft\Edge\NativeMessagingHosts\%HOST%" /f >nul 2>nul
echo Euphoric native companion registry entries removed.
pause
