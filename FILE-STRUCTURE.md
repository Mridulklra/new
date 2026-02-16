# 📂 Complete File Structure

This document provides a detailed overview of every file in the Smart Bookmark App.

```
smart-bookmark-app/
│
├── 📁 app/                           # Next.js 14 App Router
│   ├── 📄 layout.tsx                 # Root layout (includes Navbar, global styles)
│   ├── 📄 page.tsx                   # Home page (redirects to /login or /dashboard)
│   ├── 📄 globals.css                # Global CSS (Tailwind directives)
│   │
│   ├── 📁 login/
│   │   └── 📄 page.tsx               # Login page with Google OAuth button
│   │
│   ├── 📁 dashboard/
│   │   └── 📄 page.tsx               # Dashboard (stats, recent bookmarks, user info)
│   │
│   ├── 📁 bookmarks/
│   │   └── 📄 page.tsx               # Main bookmarks page (add/view/delete with realtime)
│   │
│   ├── 📁 auth/
│   │   └── 📁 callback/
│   │       └── 📄 route.ts           # OAuth callback handler for Google login
│   │
│   └── 📁 api/                       # API Routes
│       └── 📁 bookmarks/
│           ├── 📄 route.ts           # GET (fetch all) & POST (create) bookmarks
│           └── 📁 [id]/
│               └── 📄 route.ts       # DELETE bookmark by ID
│
├── 📁 components/                    # React Components
│   ├── 📄 Navbar.tsx                 # Navigation bar (logo, links, logout)
│   ├── 📄 AddBookmarkForm.tsx        # Form to add new bookmarks
│   └── 📄 BookmarkList.tsx           # Displays bookmarks with real-time updates
│
├── 📁 lib/                           # Utility libraries
│   ├── 📁 supabase/
│   │   ├── 📄 client.ts              # Client-side Supabase instance
│   │   └── 📄 server.ts              # Server-side Supabase instance
│   ├── 📄 prisma.ts                  # Prisma client singleton
│   └── 📄 types.ts                   # TypeScript type definitions
│
├── 📁 prisma/
│   └── 📄 schema.prisma              # Database schema (Bookmark model)
│
├── 📄 middleware.ts                  # Auth middleware (protects routes)
├── 📄 next.config.js                 # Next.js configuration
├── 📄 tailwind.config.ts             # Tailwind CSS configuration
├── 📄 postcss.config.js              # PostCSS configuration
├── 📄 tsconfig.json                  # TypeScript configuration
├── 📄 package.json                   # Dependencies and scripts
├── 📄 .gitignore                     # Git ignore rules
├── 📄 .env.example                   # Environment variables template
├── 📄 README.md                      # Project overview and quick start
├── 📄 SETUP.md                       # Detailed setup instructions
├── 📄 DEPLOYMENT.md                  # Deployment guide
└── 📄 FILE-STRUCTURE.md              # This file
```

---

## 📄 File Descriptions

### Root Files

#### `middleware.ts`
**Purpose**: Route protection and authentication
**Key Functions**:
- Checks user authentication status
- Redirects unauthenticated users from `/dashboard` and `/bookmarks` to `/login`
- Redirects authenticated users from `/login` to `/dashboard`
- Manages Supabase auth cookies

**Flow**:
```
User visits /dashboard
  ↓
Middleware checks auth
  ↓
If not logged in → Redirect to /login
If logged in → Allow access
```

---

### App Directory (`app/`)

#### `app/layout.tsx`
**Purpose**: Root layout wrapper for all pages
**Includes**:
- HTML structure
- Navbar component
- Global CSS imports
- Font configuration (Inter)
- Metadata (title, description)

**Structure**:
```tsx
<html>
  <body>
    <Navbar />
    <main>{children}</main>
  </body>
</html>
```

#### `app/page.tsx`
**Purpose**: Home page / Landing page
**Function**: Checks if user is logged in and redirects:
- Logged in → `/dashboard`
- Not logged in → `/login`

#### `app/globals.css`
**Purpose**: Global styles
**Contains**:
- Tailwind CSS directives
- Custom background color for body

---

### Login (`app/login/`)

#### `app/login/page.tsx`
**Purpose**: Authentication page
**Features**:
- Google OAuth login button
- Auto-redirects if already authenticated
- Error handling for failed auth
- Modern, gradient background design

**Flow**:
```
User clicks "Continue with Google"
  ↓
Supabase initiates OAuth flow
  ↓
Redirects to Google login
  ↓
User authorizes
  ↓
Redirects to /auth/callback
  ↓
Callback processes auth
  ↓
Redirects to /dashboard
```

---

### Dashboard (`app/dashboard/`)

#### `app/dashboard/page.tsx`
**Purpose**: User dashboard / Overview page
**Features**:
- User profile display (name, email, avatar)
- Bookmark count statistics
- Account status indicators
- Recent bookmarks preview (5 most recent)
- Quick action links to bookmarks page

**Data Sources**:
- User data from Supabase Auth
- Bookmark count from Prisma
- Recent bookmarks from Prisma

---

### Bookmarks (`app/bookmarks/`)

#### `app/bookmarks/page.tsx`
**Purpose**: Main bookmark management page
**Features**:
- Add bookmark form (sidebar)
- Bookmark list display (main area)
- Real-time sync indicator
- Loading state
- Responsive grid layout

**Layout**:
```
┌─────────────────────────────────────┐
│  My Bookmarks                       │
├────────────┬────────────────────────┤
│            │                        │
│  Add Form  │   Bookmark List        │
│  (Sticky)  │   (Scrollable)         │
│            │                        │
│  [RT Sync] │                        │
└────────────┴────────────────────────┘
```

---

### Auth Callback (`app/auth/callback/`)

#### `app/auth/callback/route.ts`
**Purpose**: OAuth callback handler
**Function**: 
- Receives authorization code from Google
- Exchanges code for session
- Handles errors
- Redirects to dashboard or error page

---

### API Routes (`app/api/bookmarks/`)

#### `app/api/bookmarks/route.ts`
**Endpoints**:

**GET `/api/bookmarks`**
- Fetches all bookmarks for authenticated user
- Returns array of bookmarks ordered by creation date (newest first)
- Returns 401 if not authenticated

**POST `/api/bookmarks`**
- Creates new bookmark
- Requires: `url` and `title` in request body
- Returns created bookmark with ID
- Returns 400 if missing fields
- Returns 401 if not authenticated

#### `app/api/bookmarks/[id]/route.ts`
**Endpoint**:

**DELETE `/api/bookmarks/[id]`**
- Deletes bookmark by ID
- Verifies bookmark belongs to user (403 if not)
- Returns 404 if bookmark not found
- Returns 401 if not authenticated

---

### Components (`components/`)

#### `components/Navbar.tsx`
**Type**: Client Component
**Features**:
- Logo and app name
- Navigation links (Dashboard, Bookmarks)
- Logout button
- Responsive design
- Only shows when user is logged in

#### `components/AddBookmarkForm.tsx`
**Type**: Client Component
**Props**: `onAdd: (url, title) => Promise<void>`
**Features**:
- URL input field (type="url" for validation)
- Title input field
- Submit button with loading state
- Form validation
- Clears inputs after successful submission

#### `components/BookmarkList.tsx`
**Type**: Client Component
**Props**: 
- `initialBookmarks`: Initial bookmark data
- `userId`: Current user's ID for realtime filtering

**Features**:
- Displays bookmarks in a list
- Real-time updates via Supabase subscription
- Delete button for each bookmark
- Shows bookmark count
- Empty state message
- Formats timestamps
- Opens links in new tab

**Real-time Logic**:
```javascript
supabase
  .channel('bookmarks-changes')
  .on('INSERT', (payload) => {
    // Add new bookmark to list
  })
  .on('DELETE', (payload) => {
    // Remove bookmark from list
  })
  .on('UPDATE', (payload) => {
    // Update bookmark in list
  })
```

---

### Library Files (`lib/`)

#### `lib/supabase/client.ts`
**Purpose**: Client-side Supabase instance
**Usage**: In client components (`'use client'`)
**Creates**: Browser-based Supabase client
**Used for**: 
- OAuth login
- Real-time subscriptions
- Client-side queries

#### `lib/supabase/server.ts`
**Purpose**: Server-side Supabase instance
**Usage**: In server components and API routes
**Creates**: Server-based Supabase client with cookie handling
**Used for**:
- Authentication in API routes
- Server-side data fetching
- Protected routes

#### `lib/prisma.ts`
**Purpose**: Prisma client singleton
**Features**:
- Prevents multiple Prisma instances in development
- Reuses client instance
- Production-ready configuration

#### `lib/types.ts`
**Purpose**: TypeScript type definitions
**Types**:
- `Bookmark`: Bookmark data structure
- `User`: User data from Supabase

---

### Database (`prisma/`)

#### `prisma/schema.prisma`
**Purpose**: Database schema definition
**Models**:

**Bookmark**:
- `id`: UUID primary key
- `userId`: User ID (foreign key to Supabase auth.users)
- `url`: Bookmark URL
- `title`: Bookmark title
- `createdAt`: Auto-generated timestamp
- `updatedAt`: Auto-updated timestamp

**Indexes**:
- Index on `userId` for fast user-specific queries

**Table Name**: `bookmarks` (mapped from model name)

---

### Configuration Files

#### `next.config.js`
**Configuration**:
- Image domains: Allows Google profile pictures
- Can add more domains as needed

#### `tailwind.config.ts`
**Configuration**:
- Content paths for Tailwind scanning
- Theme extensions (currently default)
- Plugin configuration

#### `postcss.config.js`
**Configuration**:
- Tailwind CSS plugin
- Autoprefixer plugin

#### `tsconfig.json`
**Configuration**:
- TypeScript compiler options
- Path aliases (`@/*` → root directory)
- Include/exclude patterns
- Strict mode enabled

#### `package.json`
**Scripts**:
- `dev`: Start development server
- `build`: Build for production (includes Prisma generate)
- `start`: Start production server
- `lint`: Run ESLint
- `postinstall`: Auto-generate Prisma client

**Dependencies**:
- Runtime: Next.js, React, Supabase, Prisma Client
- Dev: TypeScript, Tailwind, Prisma CLI, ESLint

---

## 🔄 Data Flow

### Adding a Bookmark

```
User fills form → AddBookmarkForm
  ↓
onClick → POST /api/bookmarks
  ↓
API verifies auth → Prisma creates bookmark
  ↓
Database INSERT → Triggers Supabase Realtime
  ↓
BookmarkList subscription receives event
  ↓
State updates → UI updates (all tabs)
```

### Deleting a Bookmark

```
User clicks Delete → BookmarkList
  ↓
onClick → DELETE /api/bookmarks/[id]
  ↓
API verifies ownership → Prisma deletes bookmark
  ↓
Database DELETE → Triggers Supabase Realtime
  ↓
BookmarkList subscription receives event
  ↓
State updates → UI updates (all tabs)
```

### Real-time Sync

```
Tab 1: User adds bookmark
  ↓
Database INSERT
  ↓
Supabase broadcasts change
  ↓
Tab 2: Subscription receives event
  ↓
Tab 2: State updates automatically
  ↓
Tab 2: New bookmark appears (no refresh!)
```

---

## 🔐 Authentication Flow

```
User visits /bookmarks
  ↓
Middleware checks auth cookie
  ↓
No cookie? → Redirect to /login
  ↓
User clicks "Continue with Google"
  ↓
Supabase → Google OAuth
  ↓
User authorizes
  ↓
Google → /auth/callback?code=xxx
  ↓
Callback exchanges code for session
  ↓
Sets auth cookie
  ↓
Redirects to /dashboard
  ↓
Middleware sees cookie → Allows access
```

---

## 📦 Build Process

```
npm run build
  ↓
1. postinstall → prisma generate
  ↓
2. Next.js build
   - Compiles TypeScript
   - Bundles JavaScript
   - Optimizes assets
   - Generates static pages
  ↓
3. Output to .next/ directory
  ↓
Ready for deployment
```

---

## 🎨 Styling Architecture

```
Tailwind CSS
  ↓
utility classes in components
  ↓
globals.css (base styles)
  ↓
responsive design (mobile-first)
  ↓
dark mode ready (can be added)
```

---

## 📊 Database Schema Visualization

```
┌─────────────────────────────────────┐
│           bookmarks                 │
├─────────────────────────────────────┤
│ id          UUID PRIMARY KEY        │
│ user_id     TEXT NOT NULL           │
│ url         TEXT NOT NULL           │
│ title       TEXT NOT NULL           │
│ created_at  TIMESTAMP DEFAULT NOW() │
│ updated_at  TIMESTAMP               │
├─────────────────────────────────────┤
│ INDEX: user_id                      │
│ REALTIME: ENABLED                   │
└─────────────────────────────────────┘
```

---

This structure ensures clean separation of concerns, maintainability, and scalability!
