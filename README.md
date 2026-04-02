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

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed on your machine
- Node.js 18+
- Supabase project

### Installation

```bash
# Install dependencies
bun install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Run development server
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Environment Variables

Create a `.env.local` file:

```env
# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key

# App (Optional)
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Brisa Asia
```

### Supabase Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL schema from `scripts/supabase-setup.sql`
3. Create a storage bucket named `brisa-images`
4. Create an admin user in Supabase Auth
5. Add the user to the `admin_users` table

## Available Scripts

```bash
bun run dev          # Start development server
bun run build        # Build for production
bun run lint         # Run ESLint
bun run migrate:archives  # Migrate static data to Supabase
```

## Project Structure

```
src/
├── app/              # Next.js App Router
│   ├── admin/       # Admin panel
│   ├── api/         # API routes
│   ├── archive/     # Archive pages
│   ├── call/        # Call page
│   ├── news/        # News page
│   └── place/       # Place page
├── components/       # React components
├── lib/             # Utilities and API
├── hooks/           # Custom React hooks
├── contexts/        # React contexts
├── styles/          # Global styles
└── types/           # TypeScript types
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

## Deployment

### Vercel (Recommended)

```bash
# Using Vercel CLI
vercel --prod
```

Or connect your GitHub repository to Vercel for automatic deployments.

<details>
  <summary>Images</summary>
  
  <img width="1045" height="792" alt="스크린샷 2026-04-02 오전 9 48 25" src="https://github.com/user-attachments/assets/afdfcc1a-4fb8-4c4f-937d-f1429a88671a" />
  <img width="1089" height="836" alt="스크린샷 2026-04-02 오전 9 49 10" src="https://github.com/user-attachments/assets/27c776fe-27c6-4ae3-854b-dfd8c34a75ab" />
  <img width="1089" height="836" alt="스크린샷 2026-04-02 오전 9 48 40" src="https://github.com/user-attachments/assets/fa83f8a3-884c-4b7b-aa8d-83f9f10338a2" />
</details>

## License

MIT License
