# Admin System Quick Start

Quick reference for setting up and using the admin system.

## 🚀 Quick Setup (5 Steps)

### 1. Create Supabase Project
```
https://supabase.com → New Project → Save password!
```

### 2. Run Database Setup
```sql
-- In Supabase SQL Editor, run:
scripts/supabase-setup.sql
```

### 3. Create Storage Bucket
```
Storage → New bucket → Name: archive-images (Public ✅)
Add 3 policies (view, upload, delete) - see ADMIN_SETUP.md
```

### 4. Create Admin User
```
Authentication → Users → Add user → Copy user ID

-- SQL Editor:
INSERT INTO admin_users (id, email, role)
VALUES ('user-id', 'email@example.com', 'admin');
```

### 5. Add Environment Variables
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_KEY=xxx
```

## ✅ Test It

```bash
bun run dev
# Visit: http://localhost:3000/admin/login
```

## 📁 File Structure

```
src/
├── app/
│   ├── admin/
│   │   ├── layout.tsx           # Admin layout with sidebar
│   │   ├── page.tsx              # Dashboard
│   │   ├── login/page.tsx        # Login page
│   │   └── archives/
│   │       ├── page.tsx          # Archives list
│   │       ├── new/page.tsx      # Create archive
│   │       └── [id]/page.tsx     # Edit archive
│   └── api/admin/
│       ├── archives/route.ts     # GET, POST archives
│       ├── archives/[id]/route.ts # GET, PUT, DELETE archive
│       └── upload/route.ts       # POST, DELETE images
├── components/admin/
│   ├── AdminSidebar.tsx          # Sidebar navigation
│   ├── AdminHeader.tsx           # Header with logout
│   ├── ArchiveForm.tsx           # Archive create/edit form
│   ├── ArchiveList.tsx           # Archives list display
│   ├── ImageUploader.tsx         # Drag & drop uploader
│   └── SortableImageGrid.tsx    # Sortable image grid
├── lib/
│   ├── supabase/
│   │   ├── client.ts             # Browser client
│   │   └── server.ts             # Server client
│   └── api/
│       └── archives.ts           # Frontend API (with fallback)
└── middleware.ts                 # Auth middleware

scripts/
├── supabase-setup.sql            # Database schema
└── migrate-archives.ts           # Data migration script
```

## 🎯 Common Tasks

### Create Archive
```
Admin → Archives → Create New Archive
→ Fill details → Upload images → Save
```

### Reorder Images
```
Edit Archive → Drag images to reorder → Save
```

### Delete Archive
```
Archives List → Delete button → Confirm
(Images automatically deleted from storage)
```

### Migrate Static Data
```bash
bun run migrate:archives
```

## 🔑 Admin Routes

- `/admin/login` - Login page
- `/admin` - Dashboard
- `/admin/archives` - Archives list
- `/admin/archives/new` - Create archive
- `/admin/archives/[id]` - Edit archive

## 🛡️ Security Features

- ✅ Row Level Security (RLS)
- ✅ Admin-only middleware
- ✅ Secure file upload validation
- ✅ Auth state management
- ✅ Automatic fallback to static data

## 📊 Database Tables

### archives
```sql
id, season, year, title, description, slug,
image_order[], created_at, updated_at,
created_by, is_published
```

### admin_users
```sql
id, email, role, created_at
```

## 🎨 Image Upload Specs

- **Max file size**: 10MB
- **Formats**: JPG, PNG, WebP
- **Max images**: 80 per archive
- **Storage**: Supabase Storage (archive-images bucket)

## 🔧 Troubleshooting

### Login fails
```bash
# Check auth user exists
Supabase → Authentication → Users

# Check admin_users entry
SELECT * FROM admin_users WHERE email = 'your-email';
```

### Upload fails
```bash
# Check bucket exists and is public
Storage → archive-images → Settings

# Verify storage policies
Storage → archive-images → Policies (3 policies)
```

### Frontend shows old data
```bash
# Check RLS policies
Database → Tables → archives → Policies

# Verify is_published = true
SELECT slug, is_published FROM archives;
```

## 📦 Dependencies Added

```json
{
  "@supabase/supabase-js": "^2.91.1",
  "@supabase/ssr": "^0.8.0",
  "@dnd-kit/core": "^6.3.1",
  "@dnd-kit/sortable": "^10.0.0",
  "@dnd-kit/utilities": "^3.2.2",
  "react-dropzone": "^14.3.8",
  "nanoid": "^5.1.6"
}
```

## 🚢 Deploy to Vercel

```bash
# Add env vars in Vercel Dashboard:
# Settings → Environment Variables
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_KEY

# Deploy
git push origin main
```

## 📚 Full Documentation

See `ADMIN_SETUP.md` for detailed step-by-step guide.

---

Need help? Check the troubleshooting section or review the Supabase setup.
