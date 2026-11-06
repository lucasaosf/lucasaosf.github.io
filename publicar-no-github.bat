@echo off
chcp 65001 > nul
echo =========================================================================
echo   BIOKURI // Publicador Automatizado no GitHub Pages
echo =========================================================================
echo.
echo Escolha onde deseja publicar:
echo  [1] Como site raiz: https://lucasaosf.github.io/ (Recomendado)
echo  [2] Como subpasta: https://lucasaosf.github.io/portfolio/
echo.
set /p opt="Digite a opção (1 ou 2): "

cd /d "%~dp0"

if not exist ".git" (
    git init
    git branch -M main
)

git add .
git commit -m "feat: portfolio biokuri taxonomia e programacao"

if "%opt%"=="1" (
    echo.
    echo Conectando ao repositório lucasaosf.github.io...
    git remote remove origin 2>nul
    git remote add origin https://github.com/lucasaosf/lucasaosf.github.io.git
    echo Enviando para o GitHub (certifique-se de ter criado o repositório 'lucasaosf.github.io' no GitHub)...
    git push -u origin main
    echo.
    echo Concluído! Acesse: https://lucasaosf.github.io/
) else (
    echo.
    echo Conectando ao repositório portfolio...
    git remote remove origin 2>nul
    git remote add origin https://github.com/lucasaosf/portfolio.git
    echo Enviando para o GitHub (certifique-se de ter criado o repositório 'portfolio' no GitHub)...
    git push -u origin main
    echo.
    echo Concluído! Ative o GitHub Pages nas configurações do repositório:
    echo Acesse: https://lucasaosf.github.io/portfolio/
)

pause
