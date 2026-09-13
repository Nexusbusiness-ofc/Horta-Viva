@echo off
chcp 65001 >nul
title Horta Viva - Servidor Local

cd /d "%~dp0"

echo ========================================================
echo               HORTA VIVA - GUIA DE CULTIVO              
echo ========================================================
echo.

:: Garantir que o Node.js e o npm estao acessiveis.
:: A pasta do runtime do Codex pode mudar após uma atualização, por isso não
:: fica presa a uma versão específica.
set "HORTA_NODE_RUNTIME="
for /d %%R in ("C:\Users\andre\AppData\Local\OpenAI\Codex\runtimes\cua_node\*") do (
    if exist "%%~fR\bin\npm.cmd" set "HORTA_NODE_RUNTIME=%%~fR\bin"
)
if defined HORTA_NODE_RUNTIME set "PATH=%HORTA_NODE_RUNTIME%;%PATH%"

:: Verificar se o node_modules existe
if not exist "node_modules" (
    echo [1/2] A instalar dependencias da aplicacao...
    echo       Isto acontece apenas na primeira vez. Aguarde...
    echo.
    call npm.cmd install
    if errorlevel 1 (
        echo.
        echo [ERRO] Ocorreu uma falha ao instalar as dependencias.
        pause
        exit /b %errorlevel%
    )
    echo.
    echo Dependencias instaladas com sucesso!
    echo.
)

echo [2/2] A iniciar o servidor da aplicacao...
echo O Chrome ira abrir automaticamente em http://localhost:5173
echo.
echo Para fechar a app quando terminar, feche esta janela.
echo ========================================================
echo.

:: Abrir o navegador em segundo plano apos 3 segundos
start "" cmd /c "timeout /t 3 /nobreak >nul & start http://localhost:5173"

:: Iniciar o Vite
call npm.cmd run dev
pause
