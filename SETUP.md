# Smart Bookmark App - Complete Setup Guide

## 🎯 Project Overview

A real-time bookmark manager built with Next.js 14 (App Router), Supabase, Prisma, and Tailwind CSS.

### Features
- Google OAuth authentication (no email/password)
- Private bookmarks per user
- Real-time updates across tabs
- Add/delete bookmarks with URL and title
- Deployed on Vercel

---

## 📋 Prerequisites

- Node.js 18+ installed
- npm or yarn
- Git
- Supabase account (free tier works)
- Vercel account (for deployment)
- Google Cloud Console account (for OAuth)

---

## 🚀 Setup Steps

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in:
   - **Project Name**: smart-bookmark-app
   - **Database Password**: Save this securely!
   - **Region**: Choose closest to you
4. Wait for project to be created (2-3 minutes)

### 2. Get Supabase Credentials

From your Supabase dashboard:

1. Go to **Project Settings** → **API**
2. Copy and save:
   - `Project URL` (NEXT_PUBLIC_SUPABASE_URL)
   - `anon public` key (NEXT_PUBLIC_SUPABASE_ANON_KEY)

3. Go to **Project Settings** → **Database**
4. Scroll to **Connection String** → **URI**
5. Copy the connection string and replace `[YOUR-PASSWORD]` with your database password
6. This is your `DATABASE_URL`

### 3. Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable **Google+ API**:
   - Go to **APIs & Services** → **Library**
   - Search for "Google+ API"
   - Click **Enable**

4. Create OAuth credentials:
   - Go to **APIs & Services** → **Credentials**
   - Click **Create Credentials** → **OAuth client ID**
   - Configure consent screen if prompted:
     - User Type: **External**
     - App name: Smart Bookmark App
     - User support email: your email
     - Developer contact: your email
   
5. Create OAuth Client ID:
   - Application type: **Web application**
   - Name: Smart Bookmark App
   - Authorized JavaScript origins:
     - `http://localhost:3000`
     - Your Vercel domain (add after deployment)
   - Authorized redirect URIs:
     - `http://localhost:3000/auth/callback`
     - `https://your-project.vercel.app/auth/callback` (add after deployment)
   
6. Copy:
   - **Client ID** (GOOGLE_CLIENT_ID)
   - **Client Secret** (GOOGLE_CLIENT_SECRET)

### 4. Configure Supabase Auth

1. In Supabase Dashboard, go to **Authentication** → **Providers**
2. Find **Google** and enable it
3. Paste your Google Client ID and Client Secret
4. Click **Save**

### 5. Clone and Setup Project

```bash
# Create Next.js app
npx create-next-app@latest smart-bookmark-app
# Choose:
# ✓ TypeScript: Yes
# ✓ ESLint: Yes
# ✓ Tailwind CSS: Yes
# ✓ src/ directory: No
# ✓ App Router: Yes
# ✓ Import alias: No

cd smart-bookmark-app

# Install dependencies
npm install @supabase/supabase-js @supabase/ssr
npm install @prisma/client
npm install -D prisma

# Initialize Prisma
npx prisma init
```

### 6. Environment Variables

Create `.env.local` in your project root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Database
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxxx.supabase.co:5432/postgres

# Google OAuth (for Supabase)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 7. Database Schema with Prisma

Update `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Bookmark {
  id        String   @id @default(uuid())
  userId    String   @map("user_id")
  url       String
  title     String
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@index([userId])
  @@map("bookmarks")
}
```

### 8. Run Database Migrations

```bash
# Create migration
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate
```

### 9. Enable Realtime on Supabase

1. In Supabase Dashboard, go to **Database** → **Replication**
2. Find the `bookmarks` table
3. Toggle **Enable Realtime** to ON
4. Click **Save**

---

## 📁 Project Structure

```
smart-bookmark-app/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Landing page (redirects to login or dashboard)
│   ├── login/
│   │   └── page.tsx            # Login page with Google OAuth
│   ├── dashboard/
│   │   └── page.tsx            # Dashboard (shows stats)
│   ├── bookmarks/
│   │   └── page.tsx            # Main bookmark page (add/view/delete)
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts        # OAuth callback handler
│   └── api/
│       └── bookmarks/
│           ├── route.ts        # GET/POST bookmarks
│           └── [id]/
│               └── route.ts    # DELETE bookmark
├── components/
│   ├── BookmarkList.tsx        # Bookmark display with realtime
│   ├── AddBookmarkForm.tsx     # Add bookmark form
│   ├── Navbar.tsx              # Navigation
│   └── ProtectedRoute.tsx      # Auth guard
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # Client-side Supabase
│   │   ├── server.ts           # Server-side Supabase
│   │   └── middleware.ts       # Middleware for auth
│   ├── prisma.ts               # Prisma client instance
│   └── types.ts                # TypeScript types
├── prisma/
│   └── schema.prisma           # Database schema
├── middleware.ts               # Route protection
├── .env.local                  # Environment variables
├── next.config.js              # Next.js config
├── tailwind.config.ts          # Tailwind config
└── package.json
```

---

## 🎨 Page Details

### 1. Login Page (`/login`)
- Google OAuth button
- Redirects to `/dashboard` after login
- Redirects to `/bookmarks` if already logged in

### 2. Dashboard Page (`/dashboard`)
- Shows user info (name, email, profile picture)
- Displays bookmark count
- Quick link to bookmarks page
- Logout button

### 3. Bookmarks Page (`/bookmarks`)
- Add bookmark form (URL + Title)
- Real-time bookmark list
- Delete button for each bookmark
- Auto-updates when bookmarks are added/deleted in other tabs

---

## 🔧 Implementation Files

I'll create all the necessary files for you. The key files are:

1. **Supabase Client Setup** (`lib/supabase/client.ts`, `lib/supabase/server.ts`)
2. **Prisma Client** (`lib/prisma.ts`)
3. **Middleware** (`middleware.ts`)
4. **API Routes** (`app/api/bookmarks/route.ts`)
5. **Pages** (Login, Dashboard, Bookmarks)
6. **Components** (BookmarkList with realtime, AddBookmarkForm, Navbar)

---

## 🚀 Running Locally

```bash
# Install dependencies
npm install

# Run Prisma migrations
npx prisma migrate dev

# Start development server
npm run dev
```

Visit: http://localhost:3000

---

## 🌐 Deployment to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin your-github-repo-url
git push -u origin main
```

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **Import Project**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: (leave default)
   
5. Add Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `DATABASE_URL`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`

6. Click **Deploy**

### 3. Update OAuth Redirect URLs

After deployment, get your Vercel URL (e.g., `https://smart-bookmark-app.vercel.app`)

1. **Google Cloud Console**:
   - Add `https://your-app.vercel.app` to Authorized JavaScript origins
   - Add `https://your-app.vercel.app/auth/callback` to Authorized redirect URIs

2. **Supabase Dashboard**:
   - Go to **Authentication** → **URL Configuration**
   - Add `https://your-app.vercel.app/**` to Redirect URLs

---

## 🔍 Testing Real-time Sync

1. Open your app in two browser tabs
2. In Tab 1: Add a bookmark
3. In Tab 2: Watch it appear automatically (no refresh needed!)
4. In Tab 2: Delete a bookmark
5. In Tab 1: Watch it disappear automatically

---

## 🛠️ Troubleshooting

### Database Connection Issues
```bash
# Test Prisma connection
npx prisma db push

# View database in Prisma Studio
npx prisma studio
```

### OAuth Not Working
- Check redirect URIs match exactly (with/without trailing slash)
- Verify Google OAuth consent screen is configured
- Check Supabase Auth provider settings

### Realtime Not Working
- Verify Realtime is enabled on `bookmarks` table in Supabase
- Check browser console for WebSocket errors
- Ensure Supabase project is not paused (free tier)

### Build Errors on Vercel
- Ensure all environment variables are set
- Check that Prisma generate runs during build
- Verify database is accessible from Vercel

---

## 📚 Next Steps

After setup:
1. Customize styling with Tailwind CSS
2. Add bookmark categories/tags
3. Implement search functionality
4. Add bookmark import/export
5. Implement pagination for large bookmark lists

---

## 🔐 Security Notes

- Never commit `.env.local` to Git (it's in `.gitignore`)
- Use Supabase Row Level Security (RLS) for additional protection
- Rotate secrets periodically
- Enable 2FA on Google and Supabase accounts

---

## 📞 Support

- Supabase Docs: https://supabase.com/docs
- Next.js Docs: https://nextjs.org/docs
- Prisma Docs: https://www.prisma.io/docs
- Vercel Docs: https://vercel.com/docs
