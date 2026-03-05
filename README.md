# Brisa Asia

A modern fashion brand website built with Next.js and Supabase.

## Features
- Collection showcase with seasonal archives
- News, Call, and Place pages
- **Admin system** for content management (archives, pages)

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Authentication**: Supabase Auth
- **Styling**: CSS Modules
- **Animations**: Framer Motion
- **Package Manager**: Bun
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed on your machine
- Node.js 18+ (for compatibility)
- Supabase account

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd fashion-gallery

# Install dependencies
bun install

# Copy environment variables
cp .env.example .env.local

# Run development server
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Environment Variables

Create a `.env.local` file:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Brisa Asia
```

## Available Scripts

```bash
# Development
bun run dev          # Start development server

# Production
bun run build        # Build for production
bun run build:skip-version  # Build without version check
bun run start        # Start production server

# Linting
bun run lint         # Run ESLint

# Data Migration
bun run migrate:archives  # Migrate static data to Supabase
```

## Project Structure

```
fashion-gallery/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── admin/             # Admin panel
│   │   ├── api/               # API routes
│   │   ├── archive/           # Archive pages
│   │   ├── auth/              # Authentication
│   │   ├── call/              # Call page
│   │   ├── news/              # News page
│   │   ├── place/             # Place page
│   │   └── page.tsx           # Homepage
│   ├── components/            # React components
│   ├── lib/                   # Utilities and API
│   ├── hooks/                 # Custom React hooks
│   ├── contexts/              # React contexts
│   ├── styles/                # Global styles
│   └── types/                 # TypeScript types
├── public/                    # Static assets
├── scripts/                   # Utility scripts
├── docs/                      # Documentation
└── .github/workflows/         # CI/CD pipelines
```

## Admin System

The admin system provides content management capabilities:

- **Archives Management**: Create, edit, delete fashion archives with image uploads
- **Pages Management**: Edit Place, News, Call pages
- **Image Upload**: Drag & drop image upload with reordering
- **User Roles**: Master (full access) and Manager (content only)

### Admin Routes

- `/admin/login` - Login page
- `/admin` - Dashboard
- `/admin/archives` - Archives list
- `/admin/archives/new` - Create archive
- `/admin/archives/[id]` - Edit archive

### Setup

See [docs/SUPABASE_SETUP_GUIDE.md](./docs/SUPABASE_SETUP_GUIDE.md) for detailed setup instructions.

Quick setup:
1. Create Supabase project
2. Run SQL schema from `scripts/supabase-setup.sql`
3. Create storage bucket `brisa-images`
4. Create admin user in Supabase Auth
5. Add user to `admin_users` table
6. Configure environment variables

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Configure environment variables
4. Deploy

```bash
# Using Vercel CLI
npm i -g vercel
vercel --prod
```

### Docker

```bash
# Build and run
docker-compose up

# Or build manually
docker build -t fashion-gallery .
docker run -p 3000:3000 fashion-gallery
```

## Documentation

- [Supabase Setup Guide](./docs/SUPABASE_SETUP_GUIDE.md) - Complete Supabase setup instructions
- [Email Settings](./docs/SUPABASE_EMAIL_SETTINGS.md) - Email configuration guide

## License

This project is licensed under the MIT License.

---

Built with Next.js and Bun
