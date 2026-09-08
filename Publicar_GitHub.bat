@echo off
chcp 65001 >nul
echo ===================================================
echo       HORTA VIVA - PUBLICAR NO GITHUB
echo ===================================================
echo.

set GIT_BIN=C:\Users\andre\AppData\Local\Programs\Git\cmd\git.exe
if not exist "%GIT_BIN%" (
    set GIT_BIN=git
)

echo Verificando estado do repositorio local...
"%GIT_BIN%" status
echo.

set /p REPO_URL="Insira o URL do seu repositorio GitHub (ex: https://github.com/SEU_UTILIZADOR/Horta-Viva.git): "

if "%REPO_URL%"=="" (
    echo.
    echo [ERRO] URL invalido. Por favor execute novamente e insira o URL.
    pause
    exit /b 1
)

echo.
echo A configurar o remote origin...
"%GIT_BIN%" remote remove origin 2>nul
"%GIT_BIN%" remote add origin %REPO_URL%

echo.
echo A enviar o codigo para o GitHub (branch main)...
"%GIT_BIN%" push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ===================================================
    echo SUCESSO! O seu codigo foi publicado no GitHub!
    echo O GitHub Actions vai compilar e colocar o site online.
    echo ===================================================
) else (
    echo.
    echo Se pediu autenticacao ou deu erro, verifique se iniciou sessao no GitHub
    echo ou se tem permissoes no repositorio.
)

echo.
pause
