# GitHub Pages Deployment Guide

This guide will help you deploy the Toguz Korgool website to GitHub Pages.

## Prerequisites

1. A GitHub account
2. Git installed on your computer
3. Node.js and npm installed

## Step 1: Create a GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon in the top right corner and select "New repository"
3. Name your repository (e.g., `toguz-korgool`)
4. Choose whether to make it public or private
5. **Do NOT** initialize with README, .gitignore, or license (we'll add these)
6. Click "Create repository"

## Step 2: Initialize Git and Push to GitHub

Open a terminal in the project root directory (`/Users/z/toguz-korgool`) and run:

```bash
# Initialize git repository (if not already initialized)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Toguz Korgool website"

# Add your GitHub repository as remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/toguz-korgool.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 3: Update Homepage in package.json

1. Open `/Users/z/toguz-korgool/client/package.json`
2. Replace `YOUR_USERNAME` in the `homepage` field with your actual GitHub username:
   ```json
   "homepage": "https://YOUR_USERNAME.github.io/toguz-korgool"
   ```
   For example, if your username is `johndoe`:
   ```json
   "homepage": "https://johndoe.github.io/toguz-korgool"
   ```

## Step 4: Deploy to GitHub Pages

Navigate to the client directory and deploy:

```bash
cd client
npm run deploy
```

This will:
1. Build the production version of your website
2. Create a `gh-pages` branch
3. Push the built files to the `gh-pages` branch

## Step 5: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on "Settings" tab
3. Scroll down to "Pages" in the left sidebar
4. Under "Source", select "Deploy from a branch"
5. Select the `gh-pages` branch
6. Select the `/ (root)` folder
7. Click "Save"

## Step 6: Access Your Website

Your website will be available at:
```
https://YOUR_USERNAME.github.io/toguz-korgool
```

**Note:** It may take a few minutes for the site to be available after deployment.

## Updating the Website

Whenever you make changes to the website:

1. Commit your changes:
   ```bash
   git add .
   git commit -m "Description of your changes"
   git push origin main
   ```

2. Deploy the updated version:
   ```bash
   cd client
   npm run deploy
   ```

## Troubleshooting

### Routes Not Working

If you're using `BrowserRouter` (which this project does), GitHub Pages may have issues with client-side routing. If you encounter 404 errors when navigating to routes:

1. You can switch to `HashRouter` in `App.js`:
   ```javascript
   import { HashRouter as Router, Routes, Route } from 'react-router-dom';
   ```
   This will make URLs look like `https://yoursite.github.io/toguz-korgool/#/play` instead of `https://yoursite.github.io/toguz-korgool/play`

2. Alternatively, you can add a `404.html` file that redirects to `index.html` (GitHub Pages will use this for client-side routing).

### Build Errors

If you encounter build errors:
- Make sure all dependencies are installed: `npm install`
- Check for any linting errors: `npm run build`
- Review the error messages in the terminal

## Custom Domain (Optional)

If you have a custom domain, you can:
1. Add a `CNAME` file in the `client/public` folder with your domain name
2. Configure your domain's DNS settings to point to GitHub Pages
3. Update the `homepage` field in `package.json` to your custom domain
