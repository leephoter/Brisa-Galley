-- =====================================================
-- Fashion Gallery - Complete Supabase Setup Script
-- =====================================================
-- This script sets up all tables, policies, and storage
-- for the Fashion Gallery admin system with SSO support
-- =====================================================

-- =====================================================
-- 1. ADMIN USERS TABLE
-- =====================================================

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(20) DEFAULT 'manager',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  confirmed_at TIMESTAMP WITH TIME ZONE
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can view themselves" ON admin_users;

-- Create policy: Users can view their own record
CREATE POLICY "Admins can view themselves"
ON admin_users FOR SELECT
USING (auth.uid() = id);

-- =====================================================
-- 2. ARCHIVES TABLE
-- =====================================================

-- Create archives table
CREATE TABLE IF NOT EXISTS archives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  season VARCHAR(50) NOT NULL,
  year INTEGER NOT NULL,
  title VARCHAR(200) NOT NULL,
  label VARCHAR(200),
  description TEXT,
  slug VARCHAR(200) UNIQUE NOT NULL,
  image_order TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  is_published BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_archives_slug ON archives(slug);
CREATE INDEX IF NOT EXISTS idx_archives_year ON archives(year DESC);
CREATE INDEX IF NOT EXISTS idx_archives_display_order ON archives(display_order);
CREATE INDEX IF NOT EXISTS idx_archives_is_published ON archives(is_published);

-- Enable RLS
ALTER TABLE archives ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view published archives" ON archives;
DROP POLICY IF EXISTS "Admins can do everything on archives" ON archives;

-- Policy: Anyone can view published archives
CREATE POLICY "Anyone can view published archives"
ON archives FOR SELECT
USING (is_published = true);

-- Policy: Admins can do everything
CREATE POLICY "Admins can do everything on archives"
ON archives FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.id = auth.uid()
  )
);

-- =====================================================
-- 3. PAGES TABLE
-- =====================================================

-- Create pages table
CREATE TABLE IF NOT EXISTS pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_key VARCHAR(50) UNIQUE NOT NULL,
  title VARCHAR(200) NOT NULL,
  label VARCHAR(200),
  description TEXT,
  slug VARCHAR(200) UNIQUE NOT NULL,
  content TEXT,
  is_published BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_pages_page_key ON pages(page_key);
CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);
CREATE INDEX IF NOT EXISTS idx_pages_display_order ON pages(display_order);

-- Enable RLS
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view published pages" ON pages;
DROP POLICY IF EXISTS "Admins can do everything on pages" ON pages;

-- Policy: Anyone can view published pages
CREATE POLICY "Anyone can view published pages"
ON pages FOR SELECT
USING (is_published = true);

-- Policy: Admins can do everything
CREATE POLICY "Admins can do everything on pages"
ON pages FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.id = auth.uid()
  )
);

-- Insert default pages (if not exists)
INSERT INTO pages (page_key, title, label, slug, display_order)
VALUES
  ('place', 'PLACE', 'PLACE', 'place', 1),
  ('news', 'NEWS', 'NEWS', 'news', 2),
  ('call', 'CALL', 'CALL', 'call', 3)
ON CONFLICT (page_key) DO NOTHING;

-- =====================================================
-- 4. STORAGE POLICIES (brisa-images bucket)
-- =====================================================
-- Note: Create the bucket 'brisa-images' in Supabase Dashboard first
-- Storage > Create Bucket > Name: brisa-images (Public)
-- =====================================================

-- Drop existing storage policies
DROP POLICY IF EXISTS "Anyone can view archive images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload archive images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete archive images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update archive images" ON storage.objects;

-- Policy: Anyone can view images
CREATE POLICY "Anyone can view archive images"
ON storage.objects FOR SELECT
USING (bucket_id = 'brisa-images');

-- Policy: Admins can upload images
CREATE POLICY "Admins can upload archive images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'brisa-images'
  AND EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.id = auth.uid()
  )
);

-- Policy: Admins can delete images
CREATE POLICY "Admins can delete archive images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'brisa-images'
  AND EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.id = auth.uid()
  )
);

-- Policy: Admins can update images
CREATE POLICY "Admins can update archive images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'brisa-images'
  AND EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.id = auth.uid()
  )
);

-- =====================================================
-- 5. VERIFICATION QUERIES
-- =====================================================

-- Check all tables exist
SELECT
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE columns.table_name = tables.table_name) as column_count
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('admin_users', 'archives', 'pages')
ORDER BY table_name;

-- Check RLS is enabled
SELECT
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('admin_users', 'archives', 'pages');

-- Check all policies
SELECT
  schemaname,
  tablename,
  policyname,
  cmd
FROM pg_policies
WHERE schemaname IN ('public', 'storage')
ORDER BY schemaname, tablename, policyname;

-- Check indexes
SELECT
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('admin_users', 'archives', 'pages')
ORDER BY tablename, indexname;

-- =====================================================
-- 6. ADD YOUR FIRST ADMIN USER
-- =====================================================
-- After creating a user in Supabase Authentication,
-- run this query with the user's UUID and email:
-- =====================================================

/*
INSERT INTO admin_users (id, email, role, confirmed_at)
VALUES (
  'USER_UUID_FROM_AUTH_USERS',
  'admin@example.com',
  'master',
  NOW()
);
*/

-- =====================================================
-- 7. USEFUL QUERIES
-- =====================================================

-- View all admin users
-- SELECT * FROM admin_users ORDER BY created_at DESC;

-- View current user
-- SELECT auth.uid(), auth.email();

-- Check if current user is admin
-- SELECT EXISTS(SELECT 1 FROM admin_users WHERE id = auth.uid());

-- Count archives
-- SELECT COUNT(*) FROM archives;

-- Count pages
-- SELECT COUNT(*) FROM pages;

-- View storage objects count
-- SELECT COUNT(*) FROM storage.objects WHERE bucket_id = 'brisa-images';
