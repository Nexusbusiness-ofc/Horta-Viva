@echo off
chcp 65001 >nul
echo =======================================================================
echo              HORTA VIVA - PUBLICAR NO GITHUB
echo =======================================================================
echo.

set GIT_BIN=C:\Users\andre\AppData\Local\Programs\Git\cmd\git.exe
if not exist "%GIT_BIN%" (
    set GIT_BIN=git
)

set DEFAULT_REPO=https://github.com/Nexusbusiness-ofc/Horta-Viva.git

echo Repositorio pre-configurado: %DEFAULT_REPO%
echo.
echo Prima ENTER para publicar diretamente neste repositorio,
set /p REPO_URL="ou introduza outro URL caso queira alterar: "

if "%REPO_URL%"=="" set REPO_URL=%DEFAULT_REPO%

echo.
echo A configurar ligacao ao GitHub...
"%GIT_BIN%" remote remove origin 2>nul
"%GIT_BIN%" remote add origin %REPO_URL%

echo.
echo =======================================================================
echo A enviar o codigo para o GitHub (branch main)...
echo NOTA: Se abrir uma janela no seu navegador para autorizar o GitHub,
echo clique em "Authorize" para confirmar o envio.
echo =======================================================================
echo.

"%GIT_BIN%" push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo =======================================================================
    echo  SUCESSO! O seu codigo foi publicado no GitHub com sucesso!
    echo.
    echo  O GitHub Actions vai compilar e colocar o site online em cerca de 1 min.
    echo  O seu site ficara disponivel em:
    echo  https://nexusbusiness-ofc.github.io/Horta-Viva/
    echo =======================================================================
) else (
    echo.
    echo [AVISO] Ocorreu um problema ao enviar. 
    echo Se pediu autenticacao, certifique-se de que iniciou sessao no GitHub.
)

echo.
pause
