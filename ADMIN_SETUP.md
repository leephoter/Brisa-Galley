# Admin System Setup Guide - Phase 1

This guide will help you set up the admin system for managing Archive images in your Fashion Gallery.

## Overview

Phase 1 includes:
- ✅ Archives image management (create, edit, delete)
- ✅ Image drag & drop upload
- ✅ Image reordering (drag & drop)
- ✅ Admin authentication
- ✅ Fallback to static data if Supabase fails

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in project details:
   - **Name**: fashion-gallery (or your choice)
   - **Database Password**: Create a strong password (save it securely!)
   - **Region**: Choose the closest to your users (e.g., Seoul for Korea)
4. Click "Create new project" and wait for setup to complete

## Step 2: Set Up Database

1. In your Supabase project, go to **SQL Editor**
2. Click "New query"
3. Copy and paste the contents of `scripts/supabase-setup.sql`
4. Click "Run" to execute the SQL

This creates:
- `archives` table for storing archive data
- `admin_users` table for admin authorization
- Row Level Security (RLS) policies
- Database indexes for performance

## Step 3: Create Storage Bucket

1. Go to **Storage** in the Supabase dashboard
2. Click "Create a new bucket"
3. Enter bucket details:
   - **Name**: `archive-images`
   - **Public bucket**: ✅ Enable (images need to be publicly accessible)
4. Click "Create bucket"

### Set Up Storage Policies

1. Click on the `archive-images` bucket
2. Go to the **Policies** tab
3. Add the following policies:

**Policy 1: Anyone can view images**
- Name: "Anyone can view archive images"
- Policy command: SELECT
- Policy definition:
```sql
bucket_id = 'archive-images'
```

**Policy 2: Admins can upload images**
- Name: "Admins can upload archive images"
- Policy command: INSERT
- WITH CHECK:
```sql
bucket_id = 'archive-images'
AND EXISTS (
  SELECT 1 FROM admin_users
  WHERE admin_users.id = auth.uid()
)
```

**Policy 3: Admins can delete images**
- Name: "Admins can delete archive images"
- Policy command: DELETE
- USING expression:
```sql
bucket_id = 'archive-images'
AND EXISTS (
  SELECT 1 FROM admin_users
  WHERE admin_users.id = auth.uid()
)
```

## Step 4: Create Admin User

1. Go to **Authentication** > **Users**
2. Click "Add user" > "Create new user"
3. Enter your admin email and password
4. Click "Create user"
5. **Copy the user's ID** (you'll need it in the next step)

### Add User to Admin Table

1. Go back to **SQL Editor**
2. Run this query (replace the values with your info):

```sql
INSERT INTO admin_users (id, email, role)
VALUES ('paste-user-id-here', 'your-email@example.com', 'admin');
```

## Step 5: Configure Environment Variables

1. In your Supabase project, go to **Settings** > **API**
2. Copy the following values:
   - **Project URL**
   - **anon public** key
   - **service_role** key (keep this secret!)

3. Update your `.env.local` file:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_KEY=your-service-role-key-here
```

## Step 6: Test the Setup

1. Start your development server:
```bash
bun run dev
```

2. Navigate to `http://localhost:3000/admin/login`

3. Log in with your admin credentials

4. You should see the admin dashboard!

## Step 7: Migrate Existing Data (Optional)

If you want to migrate your existing static archive data to Supabase:

```bash
bun run migrate:archives
```

This will copy all archives from `src/lib/data.ts` to your Supabase database.

## Using the Admin System

### Creating a New Archive

1. Go to **Archives** in the admin panel
2. Click "Create New Archive"
3. Fill in the details:
   - **Season**: Select SPRING/SUMMER or FALL/WINTER
   - **Year**: Enter the year
   - **Title**: e.g., "2026 SS"
   - **Slug**: URL-friendly identifier (e.g., "2026-ss")
   - **Description**: Optional description
4. Upload images:
   - Drag & drop multiple images (up to 80)
   - Or click to select files
   - Supports JPG, PNG, WebP (max 10MB per file)
5. Reorder images by dragging them
6. Click "Create Archive"

### Editing an Archive

1. Go to **Archives** and click "Edit" on any archive
2. Modify any fields
3. Add more images or delete existing ones
4. Reorder images by dragging
5. Click "Update Archive"

### Deleting an Archive

1. Go to **Archives**
2. Click "Delete" on the archive you want to remove
3. Confirm the deletion
4. All associated images in storage will also be deleted

## Frontend Integration

The frontend automatically fetches data from Supabase. If Supabase is unavailable, it falls back to static data from `src/lib/data.ts`.

Archives are fetched using:
- `getArchives()` - Get all published archives
- `getArchiveBySlug(slug)` - Get a specific archive by slug

## Vercel Deployment

### Environment Variables

In your Vercel project settings, add:

1. Go to **Settings** > **Environment Variables**
2. Add the three Supabase environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_KEY`
3. Make sure to add them for all environments (Production, Preview, Development)

### Deploy

```bash
git add .
git commit -m "Add admin system Phase 1"
git push
```

Vercel will automatically deploy your changes.

## Troubleshooting

### Cannot log in
- ✅ Check that your user exists in Supabase Authentication
- ✅ Verify the user is in the `admin_users` table
- ✅ Check environment variables are correct

### Images not uploading
- ✅ Verify the `archive-images` bucket exists and is public
- ✅ Check storage policies are correctly set
- ✅ Ensure file size is under 10MB
- ✅ Verify file type is JPG, PNG, or WebP

### RLS Policy Error
- ✅ Make sure Row Level Security is enabled
- ✅ Verify all policies are created correctly
- ✅ Check that the user is in the `admin_users` table

### Frontend showing old data
- ✅ Clear browser cache
- ✅ Check Supabase connection in browser console
- ✅ Verify `is_published` is set to `true` for archives

## Security Notes

- ⚠️ Never commit `.env.local` to git
- ⚠️ Keep your `SUPABASE_SERVICE_KEY` secret
- ⚠️ Only grant admin access to trusted users
- ⚠️ The anon key is safe to expose in the browser

## Phase 2 Preview

Future phases will include:
- 📋 Navigation menu management
- 🎨 Collections management
- 🛍️ Products management
- 🔍 Search and filtering
- 👥 Role-based permissions
- 📊 Activity logs

## Support

If you encounter any issues:
1. Check the browser console for errors
2. Verify your Supabase setup matches this guide
3. Test the API endpoints directly
4. Review the RLS policies in Supabase

---

Built with Next.js 16, Supabase, and React 19
