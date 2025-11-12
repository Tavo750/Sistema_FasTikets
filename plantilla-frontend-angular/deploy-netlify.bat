@echo off
REM Script de despliegue automatizado para Netlify en Windows
REM Ejecuta: deploy-netlify.bat [preview|production]

echo.
echo ========================================
echo   Despliegue a Netlify - FasTikets
echo ========================================
echo.

REM Verificar si Netlify CLI esta instalado
where netlify >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Netlify CLI no esta instalado
    echo Instalando Netlify CLI...
    call npm install -g netlify-cli
)

REM Limpiar directorio de build anterior
echo [INFO] Limpiando build anterior...
if exist dist (
    rmdir /s /q dist
)

REM Construir la aplicacion
echo [INFO] Construyendo aplicacion...
call npm run build

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Error en el build
    exit /b 1
)

echo [OK] Build completado exitosamente
echo.

REM Determinar tipo de despliegue
set DEPLOY_TYPE=%1
if "%DEPLOY_TYPE%"=="" set DEPLOY_TYPE=preview

if "%DEPLOY_TYPE%"=="production" (
    echo [INFO] Desplegando a PRODUCCION...
    call netlify deploy --prod --dir=dist/plantilla/browser
) else if "%DEPLOY_TYPE%"=="prod" (
    echo [INFO] Desplegando a PRODUCCION...
    call netlify deploy --prod --dir=dist/plantilla/browser
) else (
    echo [INFO] Desplegando PREVIEW...
    call netlify deploy --dir=dist/plantilla/browser
)

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   Despliegue exitoso!
    echo ========================================
) else (
    echo [ERROR] Error en el despliegue
    exit /b 1
)
