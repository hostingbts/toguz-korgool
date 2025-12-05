# Quick Start: Deploy to GitHub Pages

## Step 1: Update Homepage URL

Edit `/Users/z/toguz-korgool/client/package.json` and replace `YOUR_USERNAME` with your GitHub username:

```json
"homepage": "https://YOUR_USERNAME.github.io/toguz-korgool"
```

## Step 2: Initialize Git (if not already done)

```bash
cd /Users/z/toguz-korgool
git init
git add .
git commit -m "Initial commit"
```

## Step 3: Create GitHub Repository

1. Go to https://github.com/new
2. Create a new repository named `toguz-korgool`
3. **Don't** initialize with README, .gitignore, or license

## Step 4: Connect and Push

```bash
git remote add origin https://github.com/YOUR_USERNAME/toguz-korgool.git
git branch -M main
git push -u origin main
```

## Step 5: Deploy

```bash
cd client
npm run deploy
```

## Step 6: Enable GitHub Pages

1. Go to your repository on GitHub
2. Settings → Pages
3. Source: `gh-pages` branch, `/ (root)` folder
4. Save

Your site will be live at: `https://YOUR_USERNAME.github.io/toguz-korgool`

---

For detailed instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

