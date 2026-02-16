# 🚀 Deployment Guide - Smart Bookmark App

## Pre-Deployment Checklist

Before deploying to Vercel, ensure you have:

- ✅ Supabase project created and configured
- ✅ Google OAuth credentials set up
- ✅ All environment variables ready
- ✅ Code pushed to GitHub
- ✅ Database migrations run successfully locally

---

## Step-by-Step Deployment

### 1. Prepare Your Repository

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Smart Bookmark App"

# Create GitHub repository and push
git remote add origin <your-github-repo-url>
git branch -M main
git push -u origin main
```

### 2. Deploy to Vercel

#### Option A: Using Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click **"Import Project"**
3. Select your GitHub repository
4. Configure project settings:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./`
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

5. Add Environment Variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
DATABASE_URL=your_postgresql_connection_string
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

6. Click **"Deploy"**

#### Option B: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts, then deploy to production
vercel --prod
```

### 3. Update OAuth Redirect URLs

After deployment, you'll get a URL like: `https://smart-bookmark-app.vercel.app`

#### Update Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to **APIs & Services** → **Credentials**
3. Click on your OAuth 2.0 Client ID
4. Add to **Authorized JavaScript origins**:
   ```
   https://your-app.vercel.app
   ```
5. Add to **Authorized redirect URIs**:
   ```
   https://your-app.vercel.app/auth/callback
   ```
6. Click **Save**

#### Update Supabase

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **URL Configuration**
3. Add to **Redirect URLs**:
   ```
   https://your-app.vercel.app/**
   ```
4. Click **Save**

### 4. Test Your Deployment

1. Visit your Vercel URL
2. Click "Continue with Google"
3. Authorize the app
4. Add a bookmark
5. Open another tab and verify real-time sync works

---

## Environment Variables Reference

### Required Variables

| Variable | Description | Where to Find |
|----------|-------------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key | Supabase Dashboard → Settings → API |
| `DATABASE_URL` | PostgreSQL connection string | Supabase Dashboard → Settings → Database |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | Google Cloud Console → Credentials |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | Google Cloud Console → Credentials |

### Important Notes

- Never commit `.env.local` to GitHub
- All `NEXT_PUBLIC_` variables are exposed to the browser
- Use Vercel's environment variable encryption for production

---

## Continuous Deployment

Vercel automatically deploys when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main

# Vercel will automatically deploy
```

### Preview Deployments

Every pull request gets a preview URL:
- Push to a branch
- Create a pull request
- Vercel generates a preview URL
- Test before merging to main

---

## Custom Domain Setup

### 1. Add Domain in Vercel

1. Go to your project in Vercel
2. Click **Settings** → **Domains**
3. Add your domain (e.g., `bookmark.yourdomain.com`)
4. Follow DNS configuration instructions

### 2. Update OAuth URLs

Add your custom domain to:
- Google Cloud Console redirect URIs: `https://bookmark.yourdomain.com/auth/callback`
- Supabase redirect URLs: `https://bookmark.yourdomain.com/**`

---

## Monitoring & Logs

### View Deployment Logs

1. Go to Vercel Dashboard
2. Click on your project
3. Click **Deployments**
4. Click on a deployment to view logs

### Runtime Logs

1. Go to project in Vercel
2. Click **Logs** tab
3. Filter by:
   - Edge Functions
   - Build Logs
   - Runtime Logs

---

## Troubleshooting

### Build Failures

**Issue**: Prisma client generation fails
```bash
# Solution: Ensure postinstall script is in package.json
"postinstall": "prisma generate"
```

**Issue**: Environment variables not found
- Check variables are added in Vercel dashboard
- Variable names match exactly (case-sensitive)
- Redeploy after adding variables

### OAuth Issues

**Issue**: "Redirect URI mismatch"
- Verify redirect URIs include `/auth/callback`
- Check for trailing slashes (with and without)
- Wait a few minutes for Google to propagate changes

**Issue**: "Invalid client"
- Verify Google Client ID and Secret are correct
- Check they match in both Vercel and Supabase

### Database Issues

**Issue**: "Can't reach database server"
- Verify `DATABASE_URL` is correct
- Check Supabase project is not paused (free tier auto-pauses)
- Ensure connection string includes password

### Real-time Not Working

**Issue**: Real-time updates don't appear
- Verify Realtime is enabled on `bookmarks` table in Supabase
- Check browser console for WebSocket errors
- Ensure Supabase URL and keys are correct

---

## Performance Optimization

### Edge Functions

Vercel automatically deploys your API routes as Edge Functions for low latency.

### Caching

Next.js automatically caches static assets. For dynamic routes:

```typescript
// In route.ts files
export const dynamic = 'force-dynamic' // For always-fresh data
export const revalidate = 60 // Revalidate every 60 seconds
```

### Database Connection Pooling

Prisma uses connection pooling by default. For Vercel, ensure your connection string uses connection pooling:

```
DATABASE_URL=postgresql://postgres:password@db.xxx.supabase.co:6543/postgres?pgbouncer=true
```

---

## Security Best Practices

### 1. Environment Variables
- Never expose secrets in client-side code
- Use `NEXT_PUBLIC_` prefix only for truly public values
- Rotate secrets periodically

### 2. Database Security
- Enable Row Level Security (RLS) in Supabase
- Limit database access to Vercel IP ranges if possible

### 3. OAuth Security
- Use HTTPS only in production
- Validate redirect URIs strictly
- Enable 2FA on Google account

### 4. API Routes
- Always verify user authentication
- Validate user owns resources before modifying
- Rate limit API endpoints if needed

---

## Rollback Process

If a deployment breaks production:

1. Go to Vercel Dashboard
2. Click **Deployments**
3. Find the last working deployment
4. Click **•••** → **Promote to Production**

Or use CLI:
```bash
vercel rollback
```

---

## Scaling Considerations

### Free Tier Limits (Vercel)
- 100 GB bandwidth/month
- Unlimited deployments
- 100 GB-Hours serverless function execution

### Free Tier Limits (Supabase)
- 500 MB database size
- 2 GB bandwidth/month
- 50,000 monthly active users
- Projects pause after 1 week of inactivity

### When to Upgrade
- Upgrade Vercel Pro for:
  - Higher bandwidth
  - Better analytics
  - Team collaboration
  
- Upgrade Supabase Pro for:
  - No auto-pause
  - More storage
  - Point-in-time recovery

---

## Support & Resources

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Supabase Docs**: https://supabase.com/docs
- **Prisma Docs**: https://www.prisma.io/docs

### Getting Help

- Vercel Support: support@vercel.com
- Supabase Discord: https://discord.supabase.com
- Stack Overflow: Tag questions with `nextjs`, `supabase`, `prisma`

---

## Post-Deployment Checklist

After successful deployment:

- ✅ Test login with Google OAuth
- ✅ Add a test bookmark
- ✅ Verify real-time sync in multiple tabs
- ✅ Test delete functionality
- ✅ Check dashboard displays correctly
- ✅ Verify mobile responsiveness
- ✅ Test in different browsers
- ✅ Set up monitoring/analytics (optional)
- ✅ Configure custom domain (optional)

---

Congratulations! Your Smart Bookmark App is now live! 🎉
