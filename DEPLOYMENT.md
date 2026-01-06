# Deployment Guide

## Backend Deployment (Render)

The backend is already configured with `render.yaml`. Just connect your GitHub repo to Render and it will auto-deploy.

## Frontend Deployment (GitHub Pages)

### Automatic Deployment (Recommended)

1. **Enable GitHub Pages in your repository:**
   - Go to your repository on GitHub
   - Click on **Settings**
   - Scroll down to **Pages** section
   - Under **Source**, select **GitHub Actions**

2. **Push your code:**
   - The workflow (`.github/workflows/deploy.yml`) will automatically deploy on every push to `main` branch
   - After pushing, go to **Actions** tab to see the deployment progress

3. **Your site will be available at:**
   - `https://[your-username].github.io/[repository-name]/`

### Manual Deployment

If you prefer manual deployment:

1. Go to repository **Settings** → **Pages**
2. Under **Source**, select **Deploy from a branch**
3. Select branch: `main` (or your default branch)
4. Select folder: `/frontend`
5. Click **Save**

**Note:** Manual deployment requires the frontend folder to be at the root. The GitHub Actions workflow handles this automatically.

### Updating API URL

The frontend is configured to use:
- **Production:** `https://studx-backend.onrender.com`
- **Local Development:** Change `API_BASE_URL` in `frontend/js/script.js` to `http://localhost:3000`

### Troubleshooting

- If pages don't load, check the **Actions** tab for errors
- Make sure GitHub Pages is enabled in repository settings
- Check that the workflow file is in `.github/workflows/deploy.yml`

