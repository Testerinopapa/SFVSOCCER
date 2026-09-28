@echo off
setlocal
echo ===================================================
echo   Super Futebol Virtual - Limpeza de Cache Android
echo ===================================================

echo [1/5] Parando daemons do Gradle...
cd /d "%~dp0android"
call .\gradlew.bat --stop

echo [2/5] Limpando artefatos intermediarios de build...
call .\gradlew.bat clean
cd /d "%~dp0"

echo [3/5] Removendo cache local do projeto (android\.gradle)...
if exist "android\.gradle" rd /s /q "android\.gradle"

echo [4/5] Limpando build-cache e logs do Gradle no usuario...
if exist "%USERPROFILE%\.gradle\caches\build-cache-1" rd /s /q "%USERPROFILE%\.gradle\caches\build-cache-1"
if exist "%USERPROFILE%\.android\cache" rd /s /q "%USERPROFILE%\.android\cache"
for /d %%D in ("%USERPROFILE%\.gradle\daemon\*") do (
    del /f /q "%%D\*.log" 2>nul
)

echo [5/5] Limpeza concluida com sucesso!
echo ===================================================
endlocal
