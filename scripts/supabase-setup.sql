-- Archives Table
CREATE TABLE archives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  season VARCHAR(50) NOT NULL,
  year INTEGER NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  slug VARCHAR(200) UNIQUE NOT NULL,
  image_order TEXT[], -- Array of image URLs, preserving order
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  is_published BOOLEAN DEFAULT true
);

CREATE INDEX idx_archives_slug ON archives(slug);
CREATE INDEX idx_archives_year ON archives(year);
CREATE INDEX idx_archives_published ON archives(is_published);

-- Admin Users Table
CREATE TABLE admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(20) DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE archives ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Archives
-- Anyone can view published archives
CREATE POLICY "Anyone can view published archives"
ON archives FOR SELECT
USING (is_published = true);

-- Admins can do everything
CREATE POLICY "Admins can do everything"
ON archives FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.id = auth.uid()
  )
);

-- RLS Policies for Admin Users
CREATE POLICY "Admins can view admin_users"
ON admin_users FOR SELECT
USING (auth.uid() = id);

-- Storage Policies for archive-images bucket
-- Note: Run these in the Storage > Policies section after creating the bucket

-- Anyone can view archive images
-- CREATE POLICY "Anyone can view archive images"
-- ON storage.objects FOR SELECT
-- USING (bucket_id = 'archive-images');

-- Admins can upload archive images
-- CREATE POLICY "Admins can upload archive images"
-- ON storage.objects FOR INSERT
-- WITH CHECK (
--   bucket_id = 'archive-images'
--   AND EXISTS (
--     SELECT 1 FROM admin_users
--     WHERE admin_users.id = auth.uid()
--   )
-- );

-- Admins can delete archive images
-- CREATE POLICY "Admins can delete archive images"
-- ON storage.objects FOR DELETE
-- USING (
--   bucket_id = 'archive-images'
--   AND EXISTS (
--     SELECT 1 FROM admin_users
--     WHERE admin_users.id = auth.uid()
--   )
-- );

-- After creating your first admin user in Supabase Auth,
-- add them to the admin_users table with:
-- INSERT INTO admin_users (id, email, role)
-- VALUES ('your-user-id-here', 'admin@example.com', 'admin');
