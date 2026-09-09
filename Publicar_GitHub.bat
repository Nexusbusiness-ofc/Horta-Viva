@echo off
chcp 65001 >nul
title Publicar Horta Viva no GitHub
color 2F
cls
echo =======================================================================
echo                 PUBLICAR HORTA VIVA NO GITHUB
echo =======================================================================
echo.
echo Repositorio de destino:
echo https://github.com/Nexusbusiness-ofc/Horta-Viva.git
echo.
echo =======================================================================
echo.

set GIT_BIN=C:\Users\andre\AppData\Local\Programs\Git\cmd\git.exe
if not exist "%GIT_BIN%" (
    set GIT_BIN=git
)

cd /d "%USERPROFILE%\Desktop\Horta Viva"

echo A preparar o envio dos ficheiros...
"%GIT_BIN%" remote remove origin 2>nul
"%GIT_BIN%" remote add origin https://github.com/Nexusbusiness-ofc/Horta-Viva.git
"%GIT_BIN%" branch -M main

echo.
echo -----------------------------------------------------------------------
echo Escolha o metodo de envio:
echo  [1] Abrir no Navegador (Recomendado - clica em "Authorize" no browser)
echo  [2] Inserir Token de Acesso Pessoal (Personal Access Token)
echo -----------------------------------------------------------------------
echo.
set /p MODO="Escolha [1 ou 2] e prima ENTER (Padrao: 1): "

if "%MODO%"=="2" goto COM_TOKEN

:COM_BROWSER
echo.
echo =======================================================================
echo A enviar para o GitHub...
echo.
echo ATENCAO:
echo Vai abrir uma janela no seu navegador a pedir para iniciar sessao no GitHub
echo e clicar no botao verde "Authorize". Confirme no navegador.
echo =======================================================================
echo.
"%GIT_BIN%" push -u origin main
goto VERIFICAR_RESULTADO

:COM_TOKEN
echo.
echo Pode gerar um token em: https://github.com/settings/tokens
echo (com a permissao 'repo' selecionada)
echo.
set /p TOKEN="Cole o seu Token do GitHub aqui: "
if "%TOKEN%"=="" goto COM_BROWSER
echo.
echo A enviar com o token fornecido...
"%GIT_BIN%" push -u https://Nexusbusiness-ofc:%TOKEN%@github.com/Nexusbusiness-ofc/Horta-Viva.git main
goto VERIFICAR_RESULTADO

:VERIFICAR_RESULTADO
if %errorlevel% equ 0 (
    echo.
    echo =======================================================================
    echo   PARABENS! O CODIGO FOI PUBLICADO COM SUCESSO NO GITHUB!
    echo =======================================================================
    echo.
    echo O GitHub Actions esta agora a compilar o site e a coloca-lo online.
    echo.
    echo 1. Va a https://github.com/Nexusbusiness-ofc/Horta-Viva/settings/pages
    echo 2. Em "Source", confirme que esta selecionado "GitHub Actions"
    echo 3. O site ficara no ar no link:
    echo    https://nexusbusiness-ofc.github.io/Horta-Viva/
    echo =======================================================================
) else (
    echo.
    echo [ERRO] O envio nao foi concluido. Verifique a autenticacao do GitHub.
)

echo.
echo Prima qualquer tecla para sair...
pause >nul
