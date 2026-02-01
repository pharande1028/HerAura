@echo off
echo Pushing HerAura files to GitHub...

cd /d "C:\Users\Rahul Sunil Pharande\OneDrive\Desktop\HerAura_Main"

echo Adding all files...
git add .

echo Committing changes...
git commit -m "Updated HerAura project with latest features - product detail enhancements, size guide functionality, admin portal improvements"

echo Pushing to GitHub...
git push origin main

echo Done! All files pushed to https://github.com/pharande1028/HerAura

pause