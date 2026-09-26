#!/bin/bash
ng build --configuration=production --base-href="/Graduation-Invitation/"
cp 404.html dist/graduation-invitation/browser/
cp .nojekyll dist/graduation-invitation/browser/
git --work-tree=dist/graduation-invitation/browser checkout --orphan gh-pages
git --work-tree=dist/graduation-invitation/browser add --all
git commit -m "Deploy Graduation-Invitation to GitHub Pages"
git push -f origin gh-pages
git checkout -f master
echo "Deployed to https://mquun2005.github.io/Graduation-Invitation/"
