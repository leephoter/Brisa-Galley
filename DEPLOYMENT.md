# Deployment Guide

This guide covers multiple deployment options for the Brisa Gallery project.

## Table of Contents

- [Vercel (Recommended)](#vercel-recommended)
- [GitHub Actions CI/CD](#github-actions-cicd)
- [Docker](#docker)
- [Other Platforms](#other-platforms)

## Vercel (Recommended)

Vercel is the recommended deployment platform for Next.js applications.

### Quick Deploy

1. **Push to GitHub**

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo>
   git push -u origin main
   ```

2. **Import to Vercel**

   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js and configure build settings

3. **Configure Build Settings**

   - Framework Preset: Next.js
   - Build Command: `bun run build`
   - Install Command: `bun install`
   - Output Directory: `.next`

4. **Add Environment Variables** (Optional)

   - `NEXT_PUBLIC_APP_URL`: Your production URL
   - Add any other required environment variables

5. **Deploy**
   - Click "Deploy"
   - Wait for the deployment to complete
   - Your site will be live at `your-project.vercel.app`

### Custom Domain

1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Update your DNS records as instructed

### Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy preview
vercel

# Deploy to production
vercel --prod
```

## GitHub Actions CI/CD

The project includes three automated workflows:

### 1. CI Pipeline (`.github/workflows/ci.yml`)

Runs on every push to main/develop:

- ✓ Checkout code
- ✓ Setup Bun
- ✓ Install dependencies
- ✓ Run linter
- ✓ Build project

### 2. Preview Deployment (`.github/workflows/deploy-preview.yml`)

Runs on pull requests to main:

- Creates preview deployment on Vercel
- Posts deployment URL in PR comments

### 3. Production Deployment (`.github/workflows/deploy-production.yml`)

Runs on push to main:

- Deploys to Vercel production
- Automatically promotes to production

### Setup Instructions

1. **Get Vercel Tokens**

   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Login and link project
   vercel login
   vercel link
   ```

2. **Get Required Values**

   - Go to your project on Vercel
   - Settings → General
   - Copy:
     - Project ID
     - Organization ID
   - Settings → Tokens
   - Create a new token

3. **Add GitHub Secrets**

   - Go to your GitHub repository
   - Settings → Secrets and variables → Actions
   - Add these secrets:
     ```
     VERCEL_TOKEN          # Your Vercel token
     VERCEL_ORG_ID        # Your organization ID
     VERCEL_PROJECT_ID    # Your project ID
     ```

4. **Test Workflows**
   - Create a new branch
   - Make a change and push
   - Create a pull request
   - Check the Actions tab for pipeline status

## Docker

### Build and Run Locally

```bash
# Build the image
docker build -t Brisa-gallery .

# Run the container
docker run -p 3000:3000 Brisa-gallery

# Access at http://localhost:3000
```

### Using Docker Compose

```bash
# Start services
docker-compose up

# Start in detached mode
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f
```

### Deploy to Container Platforms

#### AWS ECS

1. Push image to ECR:

   ```bash
   aws ecr get-login-password --region region | docker login --username AWS --password-stdin aws_account_id.dkr.ecr.region.amazonaws.com
   docker tag Brisa-gallery:latest aws_account_id.dkr.ecr.region.amazonaws.com/Brisa-gallery:latest
   docker push aws_account_id.dkr.ecr.region.amazonaws.com/Brisa-gallery:latest
   ```

2. Create ECS task definition
3. Create ECS service
4. Configure load balancer

#### Google Cloud Run

```bash
# Build and push to GCR
gcloud builds submit --tag gcr.io/PROJECT_ID/Brisa-gallery

# Deploy to Cloud Run
gcloud run deploy Brisa-gallery \
  --image gcr.io/PROJECT_ID/Brisa-gallery \
  --platform managed \
  --region asia-northeast3 \
  --allow-unauthenticated
```

#### Azure Container Apps

```bash
# Build and push to ACR
az acr build --registry myregistry --image Brisa-gallery .

# Deploy to Container Apps
az containerapp create \
  --name Brisa-gallery \
  --resource-group myResourceGroup \
  --image myregistry.azurecr.io/Brisa-gallery:latest \
  --target-port 3000 \
  --ingress external
```

## Other Platforms

### Netlify

1. Install Netlify CLI:

   ```bash
   npm install -g netlify-cli
   ```

2. Build the project:

   ```bash
   bun run build
   ```

3. Deploy:
   ```bash
   netlify deploy --prod
   ```

### Railway

1. Install Railway CLI:

   ```bash
   npm i -g @railway/cli
   ```

2. Login and initialize:

   ```bash
   railway login
   railway init
   ```

3. Deploy:
   ```bash
   railway up
   ```

### Cloudflare Pages

1. Build the project:

   ```bash
   bun run build
   ```

2. Go to Cloudflare Dashboard
3. Pages → Create a project
4. Connect your Git repository
5. Configure build settings:
   - Build command: `bun run build`
   - Build output: `.next`

## Performance Optimization

### For Production Builds

1. **Enable Image Optimization**

   - Add image domains to `next.config.js`
   - Use Next.js Image component

2. **Enable Compression**

   - Gzip/Brotli compression (enabled by default on Vercel)

3. **CDN Configuration**

   - Use Vercel's Edge Network
   - Configure caching headers

4. **Environment Variables**
   - Set `NODE_ENV=production`
   - Optimize bundle size

## Monitoring

### Vercel Analytics

Enable in your Vercel dashboard:

- Go to your project
- Analytics tab
- Enable Web Analytics

### Error Tracking

Consider integrating:

- Sentry
- LogRocket
- Datadog

## Troubleshooting

### Build Fails

1. Check Node.js version (18+)
2. Clear cache: `rm -rf .next node_modules`
3. Reinstall: `bun install`
4. Check environment variables

### Deployment Fails

1. Check Vercel/platform logs
2. Verify environment variables
3. Check build output directory
4. Verify build command

### Performance Issues

1. Run Lighthouse audit
2. Check bundle size: `bun run build --analyze`
3. Optimize images
4. Enable caching

## Security

### Before Deploying

- [ ] Review environment variables
- [ ] Remove sensitive data from code
- [ ] Update dependencies: `bun update`
- [ ] Run security audit: `bun audit`
- [ ] Enable HTTPS
- [ ] Configure CSP headers

### Production Checklist

- [ ] Set secure environment variables
- [ ] Enable HTTPS
- [ ] Configure CORS
- [ ] Set up rate limiting
- [ ] Enable security headers
- [ ] Configure firewall rules
- [ ] Set up monitoring
- [ ] Configure backups

## Support

For deployment issues:

1. Check the [Next.js documentation](https://nextjs.org/docs)
2. Review platform-specific guides
3. Check GitHub Actions logs
4. Contact support

---

Happy deploying! 🚀
