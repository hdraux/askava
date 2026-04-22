#!/usr/bin/env bash
set -euo pipefail

git init
git add .
git commit -m "Initial MVP scaffold"

echo
echo "Next:"
echo "1. Create an empty GitHub repo"
echo "2. Run:"
echo "   git branch -M main"
echo "   git remote add origin <YOUR_GITHUB_REPO_URL>"
echo "   git push -u origin main"
