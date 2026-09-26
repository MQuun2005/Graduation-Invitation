@echo off
echo ==============================================
echo   Deploying Graduation-Invitation to GitHub Pages
echo ==============================================

REM 1. Get current git remote
for /f "tokens=*" %%i in ('git remote get-url origin') do set REMOTE_URL=%%i

REM 2. Build for GitHub Pages
call npm run build -- --configuration=production --base-href="/Graduation-Invitation/"

REM 3. Copy 404.html and .nojekyll
copy /y 404.html dist\graduation-invitation\browser\
copy /y .nojekyll dist\graduation-invitation\browser\

REM 4. Deploy isolated dist to gh-pages branch
cd dist\graduation-invitation\browser
git init
git add -A
git commit -m "Deploy Graduation-Invitation to GitHub Pages"
git remote add origin %REMOTE_URL% 2>nul
git push -f origin HEAD:gh-pages
cd ..\..\..

echo.
echo ==============================================
echo   Deployment Complete!
echo   Website URL: https://mquun2005.github.io/Graduation-Invitation/
echo ==============================================
pause
