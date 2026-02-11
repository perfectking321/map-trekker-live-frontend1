# Deployment Guide

This guide covers various deployment options for Map Trekker Live.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Build for Production](#build-for-production)
3. [Deployment Options](#deployment-options)
   - [Firebase Hosting](#firebase-hosting)
   - [Vercel](#vercel)
   - [Netlify](#netlify)
   - [GitHub Pages](#github-pages)
4. [Environment Variables](#environment-variables)
5. [Post-Deployment Checklist](#post-deployment-checklist)

---

## Prerequisites

Before deploying, ensure you have:
- ✅ Completed local development and testing
- ✅ Set up Firebase project (Authentication & Firestore)
- ✅ All environment variables configured
- ✅ Production-ready Firestore security rules
- ✅ Tested the production build locally

---

## Build for Production

Create an optimized production build:

```bash
# Install dependencies
npm install

# Create production build
npm run build

# Preview the build locally (optional)
npm run preview
```

The build output will be in the `dist/` directory.

---

## Deployment Options

### 1. Firebase Hosting

Firebase Hosting is the recommended option as it integrates seamlessly with Firebase services.

#### Step 1: Install Firebase CLI

```bash
npm install -g firebase-tools
```

#### Step 2: Login to Firebase

```bash
firebase login
```

#### Step 3: Initialize Firebase Hosting

```bash
firebase init hosting
```

Answer the prompts:
- **What do you want to use as your public directory?** `dist`
- **Configure as a single-page app?** `Yes`
- **Set up automatic builds with GitHub?** (Optional) `Yes`
- **File dist/index.html already exists. Overwrite?** `No`

#### Step 4: Deploy

```bash
# Build the project
npm run build

# Deploy to Firebase
firebase deploy --only hosting
```

Your app will be live at: `https://your-project-id.web.app`

#### Custom Domain (Optional)

1. Go to Firebase Console > Hosting
2. Click "Add custom domain"
3. Follow the DNS configuration instructions

---

### 2. Vercel

Vercel offers excellent performance and automatic deployments from Git.

#### Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

#### Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add environment variables in Vercel dashboard
6. Click "Deploy"

#### Environment Variables

Add these in Vercel dashboard (Settings > Environment Variables):
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

### 3. Netlify

Netlify provides continuous deployment and serverless functions.

#### Deploy via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build the project
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

#### Deploy via Netlify Dashboard

1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" > "Import an existing project"
3. Connect your Git repository
4. Configure:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Add environment variables
6. Click "Deploy site"

#### Configure Redirects

Create `public/_redirects`:
```
/*    /index.html   200
```

This ensures proper routing for a SPA.

---

### 4. GitHub Pages

Suitable for hosting static sites directly from a GitHub repository.

#### Step 1: Install gh-pages

```bash
npm install --save-dev gh-pages
```

#### Step 2: Update package.json

Add these scripts:
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
  "homepage": "https://yourusername.github.io/map-trekker-live-frontend1"
}
```

#### Step 3: Update vite.config.ts

```typescript
export default defineConfig({
  base: '/map-trekker-live-frontend1/',
  // ... rest of config
});
```

#### Step 4: Deploy

```bash
npm run deploy
```

#### Step 5: Configure GitHub Pages

1. Go to repository Settings > Pages
2. Source: Deploy from branch
3. Branch: `gh-pages` / `root`
4. Save

Your site will be live at: `https://yourusername.github.io/map-trekker-live-frontend1`

---

## Environment Variables

### For Production

Create a `.env.production` file:

```env
VITE_FIREBASE_API_KEY=your_production_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_production_domain
VITE_FIREBASE_PROJECT_ID=your_production_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_production_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_production_sender_id
VITE_FIREBASE_APP_ID=your_production_app_id
```

### Security Best Practices

1. **Never** commit `.env` files to Git
2. Use different Firebase projects for development and production
3. Restrict API keys in Firebase Console
4. Enable only required Firebase services
5. Use Firestore security rules to protect data

---

## Post-Deployment Checklist

After deployment, verify:

- [ ] Application loads without errors
- [ ] Authentication works (login/register)
- [ ] Driver can share location
- [ ] Users can view buses on map
- [ ] Map tiles load correctly
- [ ] Routing and ETA calculations work
- [ ] Responsive design on mobile devices
- [ ] All environment variables are set correctly
- [ ] HTTPS is enabled
- [ ] Custom domain is configured (if applicable)
- [ ] Firebase authorized domains include your production URL
- [ ] Firestore security rules are in production mode
- [ ] Error tracking is set up (optional)
- [ ] Analytics is working (optional)

---

## Authorized Domains in Firebase

Add your production domain to Firebase authorized domains:

1. Go to Firebase Console
2. Authentication > Settings > Authorized domains
3. Click "Add domain"
4. Enter your domain (e.g., `your-app.vercel.app`)
5. Save

---

## Continuous Deployment

### GitHub Actions (Firebase Hosting)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Firebase Hosting

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        env:
          VITE_FIREBASE_API_KEY: ${{ secrets.VITE_FIREBASE_API_KEY }}
          VITE_FIREBASE_AUTH_DOMAIN: ${{ secrets.VITE_FIREBASE_AUTH_DOMAIN }}
          VITE_FIREBASE_PROJECT_ID: ${{ secrets.VITE_FIREBASE_PROJECT_ID }}
          VITE_FIREBASE_STORAGE_BUCKET: ${{ secrets.VITE_FIREBASE_STORAGE_BUCKET }}
          VITE_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.VITE_FIREBASE_MESSAGING_SENDER_ID }}
          VITE_FIREBASE_APP_ID: ${{ secrets.VITE_FIREBASE_APP_ID }}
          
      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: your-project-id
```

---

## Monitoring & Analytics

### Google Analytics

Already configured via Firebase. Check analytics in Firebase Console.

### Error Tracking

Consider adding:
- **Sentry**: For error tracking
- **LogRocket**: For session replay
- **Firebase Crashlytics**: For crash reporting

---

## Performance Optimization

Before deploying, optimize your app:

1. **Code Splitting**: Vite handles this automatically
2. **Lazy Loading**: Load routes on-demand
3. **Image Optimization**: Use WebP format
4. **Caching**: Configure proper cache headers
5. **Compression**: Enable Gzip/Brotli compression
6. **CDN**: Use a CDN for static assets

---

## Rollback Strategy

If deployment fails:

### Firebase Hosting
```bash
firebase hosting:clone SOURCE_SITE_ID:SOURCE_CHANNEL_ID TARGET_SITE_ID:live
```

### Vercel/Netlify
Use the dashboard to rollback to a previous deployment.

---

## Support

For deployment issues:
- Check provider-specific documentation
- Review build logs for errors
- Ensure all environment variables are set
- Verify DNS configuration for custom domains

---

## Additional Resources

- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Firebase Hosting Docs](https://firebase.google.com/docs/hosting)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com/)
