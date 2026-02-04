# Fashion Gallery - Supabase 설정 가이드

이 문서는 새 Supabase 프로젝트를 생성하고 Fashion Gallery Admin 시스템을 구축하는 전체 가이드입니다.

## 📋 목차

1. [Supabase 프로젝트 생성](#1-supabase-프로젝트-생성)
2. [데이터베이스 설정](#2-데이터베이스-설정)
3. [Storage 설정](#3-storage-설정)
4. [Authentication 설정](#4-authentication-설정)
5. [환경변수 설정](#5-환경변수-설정)
6. [첫 어드민 사용자 생성](#6-첫-어드민-사용자-생성)
7. [테스트](#7-테스트)
8. [배포](#8-배포)

---

## 1. Supabase 프로젝트 생성

### A. 계정 생성 및 프로젝트 생성

1. https://supabase.com 접속
2. GitHub 또는 이메일로 가입
3. **"New Project"** 클릭
4. 프로젝트 정보 입력:
   - **Name**: `fashion-gallery` (또는 원하는 이름)
   - **Database Password**: 강력한 비밀번호 설정 (안전하게 보관!)
   - **Region**: `Seoul (Northeast Asia)` (한국 사용자용)
   - **Pricing Plan**: Free (개발용) 또는 Pro (프로덕션용)
5. **"Create new project"** 클릭
6. 프로젝트 생성 완료 대기 (약 2분)

### B. 프로젝트 정보 확인

프로젝트 생성 후:
1. Dashboard > **Settings** > **API**
2. 다음 정보 복사 (나중에 사용):
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGc...`
   - **service_role key**: `eyJhbGc...` (비밀 유지!)

---

## 2. 데이터베이스 설정

### A. SQL 스크립트 실행

1. Supabase Dashboard > **SQL Editor** 클릭
2. **"New query"** 클릭
3. 아래 SQL을 **순서대로** 실행:

#### Step 1: admin_users 테이블

```sql
-- admin_users 테이블 생성
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(20) DEFAULT 'manager',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  confirmed_at TIMESTAMP WITH TIME ZONE
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);

-- RLS 활성화
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- 정책: 자기 자신만 조회 가능
DROP POLICY IF EXISTS "Admins can view themselves" ON admin_users;
CREATE POLICY "Admins can view themselves"
ON admin_users FOR SELECT
USING (auth.uid() = id);
```

#### Step 2: archives 테이블

```sql
-- archives 테이블 생성
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

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_archives_slug ON archives(slug);
CREATE INDEX IF NOT EXISTS idx_archives_year ON archives(year DESC);
CREATE INDEX IF NOT EXISTS idx_archives_display_order ON archives(display_order);
CREATE INDEX IF NOT EXISTS idx_archives_is_published ON archives(is_published);

-- RLS 활성화
ALTER TABLE archives ENABLE ROW LEVEL SECURITY;

-- 정책: 누구나 published archives 조회 가능
DROP POLICY IF EXISTS "Anyone can view published archives" ON archives;
CREATE POLICY "Anyone can view published archives"
ON archives FOR SELECT
USING (is_published = true);

-- 정책: 어드민만 모든 작업 가능
DROP POLICY IF EXISTS "Admins can do everything on archives" ON archives;
CREATE POLICY "Admins can do everything on archives"
ON archives FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.id = auth.uid()
  )
);
```

#### Step 3: pages 테이블

```sql
-- pages 테이블 생성
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

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_pages_page_key ON pages(page_key);
CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);
CREATE INDEX IF NOT EXISTS idx_pages_display_order ON pages(display_order);

-- RLS 활성화
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

-- 정책: 누구나 published pages 조회 가능
DROP POLICY IF EXISTS "Anyone can view published pages" ON pages;
CREATE POLICY "Anyone can view published pages"
ON pages FOR SELECT
USING (is_published = true);

-- 정책: 어드민만 모든 작업 가능
DROP POLICY IF EXISTS "Admins can do everything on pages" ON pages;
CREATE POLICY "Admins can do everything on pages"
ON pages FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.id = auth.uid()
  )
);

-- 기본 페이지 데이터 삽입
INSERT INTO pages (page_key, title, label, slug, display_order)
VALUES
  ('place', 'PLACE', 'PLACE', 'place', 1),
  ('news', 'NEWS', 'NEWS', 'news', 2),
  ('call', 'CALL', 'CALL', 'call', 3)
ON CONFLICT (page_key) DO NOTHING;
```

### B. 설정 확인

SQL Editor에서 다음 쿼리로 확인:

```sql
-- 테이블 확인
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('admin_users', 'archives', 'pages');

-- RLS 활성화 확인
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';

-- 정책 확인
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename;
```

---

## 3. Storage 설정

### A. Bucket 생성

1. Supabase Dashboard > **Storage** 클릭
2. **"Create a new bucket"** 클릭
3. Bucket 정보 입력:
   - **Name**: `brisa-images`
   - **Public bucket**: ✅ **체크** (공개 버킷으로 설정)
   - **File size limit**: `50 MB` (Free tier) 또는 더 높게
   - **Allowed MIME types**: 비워두기 (모든 이미지 허용)
4. **"Create bucket"** 클릭

### B. Storage Policies 설정

SQL Editor에서 실행:

```sql
-- 1. 누구나 이미지 조회 가능
DROP POLICY IF EXISTS "Anyone can view archive images" ON storage.objects;
CREATE POLICY "Anyone can view archive images"
ON storage.objects FOR SELECT
USING (bucket_id = 'brisa-images');

-- 2. 어드민만 이미지 업로드 가능
DROP POLICY IF EXISTS "Admins can upload archive images" ON storage.objects;
CREATE POLICY "Admins can upload archive images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'brisa-images'
  AND EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.id = auth.uid()
  )
);

-- 3. 어드민만 이미지 삭제 가능
DROP POLICY IF EXISTS "Admins can delete archive images" ON storage.objects;
CREATE POLICY "Admins can delete archive images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'brisa-images'
  AND EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.id = auth.uid()
  )
);

-- 4. 어드민만 이미지 업데이트 가능
DROP POLICY IF EXISTS "Admins can update archive images" ON storage.objects;
CREATE POLICY "Admins can update archive images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'brisa-images'
  AND EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.id = auth.uid()
  )
);
```

### C. Storage Policies 확인

```sql
-- Storage 정책 확인
SELECT policyname, cmd
FROM pg_policies
WHERE schemaname = 'storage'
  AND tablename = 'objects'
  AND policyname LIKE '%archive%';
```

---

## 4. Authentication 설정

### A. Email Provider 확인

1. Supabase Dashboard > **Authentication** > **Providers**
2. **Email** 섹션 확인:
   - **Enable Email provider**: ✅ 활성화됨 (기본값)
   - **Confirm email**: 프로덕션에서만 활성화 권장
3. **Save** (변경 시)

### B. Site URL 설정

1. **Authentication** > **URL Configuration**
2. **Site URL** 입력:
   ```
   https://your-production-domain.com
   ```
   로컬 개발 중이라면:
   ```
   http://localhost:3000
   ```

3. **Redirect URLs** 추가:
   ```
   http://localhost:3000/auth/callback
   https://your-production-domain.com/auth/callback
   https://*.vercel.app/auth/callback
   ```

4. **Save**

---

## 5. 환경변수 설정

### A. 로컬 환경 (.env.local)

프로젝트 루트에 `.env.local` 파일 생성:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_KEY=eyJhbGc...

# Node environment
NODE_ENV=development
```

**⚠️ 주의:**
- `SUPABASE_SERVICE_KEY`는 절대 Git에 커밋하지 마세요!
- `.env.local`은 `.gitignore`에 포함되어 있어야 합니다

### B. Vercel 배포 환경

1. Vercel Dashboard > Project > **Settings** > **Environment Variables**
2. 다음 3개 변수 추가:
   - `NEXT_PUBLIC_SUPABASE_URL`: `https://xxxxx.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `eyJhbGc...`
   - `SUPABASE_SERVICE_KEY`: `eyJhbGc...`
3. **Environment**: Production, Preview, Development 모두 체크
4. **Save**

---

## 6. 첫 어드민 사용자 생성

### A. Authentication에서 사용자 생성

1. **Authentication** > **Users** > **"Add user"** 클릭
2. 사용자 정보 입력:
   - **Email**: 실제 사용할 이메일
   - **Password**: 강력한 비밀번호
   - **Auto Confirm User**: ✅ **체크** (이메일 확인 스킵)
3. **"Create user"** 클릭
4. 생성된 **User ID (UUID)** 복사

### B. admin_users에 추가

SQL Editor에서:

```sql
INSERT INTO admin_users (id, email, role, confirmed_at)
VALUES (
  '방금-복사한-UUID',
  'admin@example.com',
  'master',
  NOW()
);
```

### C. 확인

```sql
-- 어드민 사용자 확인
SELECT * FROM admin_users;

-- auth.users 확인
SELECT id, email, created_at FROM auth.users;
```

---

## 7. 테스트

### A. 로컬 테스트

```bash
# 프로젝트 디렉토리에서
bun run dev
```

브라우저에서:

1. **http://localhost:3000** - 메인 페이지 확인
2. **http://localhost:3000/login** - 로그인 페이지
3. 위에서 생성한 이메일/비밀번호로 로그인
4. **http://localhost:3000/admin** - 어드민 대시보드 확인
5. **http://localhost:3000/admin/archives** - Archives 관리
6. **이미지 업로드 테스트**

### B. 데이터베이스 연결 확인

SQL Editor:

```sql
-- 모든 테이블 데이터 확인
SELECT 'admin_users' as table_name, COUNT(*) as count FROM admin_users
UNION ALL
SELECT 'archives', COUNT(*) FROM archives
UNION ALL
SELECT 'pages', COUNT(*) FROM pages;

-- Storage 확인
SELECT COUNT(*) as image_count
FROM storage.objects
WHERE bucket_id = 'brisa-images';
```

---

## 8. 배포

### A. Vercel 배포

```bash
# Vercel CLI 사용
vercel --prod

# 또는 Git push로 자동 배포
git add .
git commit -m "Setup Supabase integration"
git push origin main
```

### B. 배포 후 확인

1. 배포된 URL 접속
2. `/login` 페이지에서 로그인 테스트
3. `/admin` 페이지 접근 확인
4. 이미지 업로드 테스트

---

## ✅ 최종 체크리스트

설정 완료 후 다음을 모두 확인하세요:

### Database
- [ ] admin_users 테이블 생성
- [ ] archives 테이블 생성
- [ ] pages 테이블 생성
- [ ] 기본 pages 데이터 삽입 (3개)
- [ ] RLS 정책 설정 완료
- [ ] 인덱스 생성 완료

### Storage
- [ ] brisa-images bucket 생성 (Public)
- [ ] Storage RLS 정책 4개 생성 (SELECT, INSERT, DELETE, UPDATE)

### Authentication
- [ ] Email provider 활성화
- [ ] Site URL 설정
- [ ] Redirect URLs 추가
- [ ] 첫 어드민 사용자 생성
- [ ] admin_users에 사용자 추가

### Environment
- [ ] .env.local 파일 생성 (로컬)
- [ ] Vercel 환경변수 설정 (배포)
- [ ] .gitignore에 .env.local 포함 확인

### Testing
- [ ] 로컬 로그인 성공
- [ ] 어드민 페이지 접근 가능
- [ ] 이미지 업로드 성공
- [ ] 배포 환경 로그인 성공
- [ ] 배포 환경 이미지 업로드 성공

---

## 🔧 문제 해결

### "Bucket not found" 에러

**원인**: brisa-images bucket 미생성

**해결**:
1. Storage > Create Bucket
2. Name: `brisa-images`, Public: ✅

### "Row-level security policy violation" 에러

**원인**:
1. RLS 정책 미설정
2. 현재 사용자가 admin_users에 없음

**해결**:
```sql
-- 사용자 확인
SELECT * FROM admin_users WHERE id = auth.uid();

-- 없으면 추가
INSERT INTO admin_users (id, email, role, confirmed_at)
VALUES (auth.uid(), 'user@example.com', 'master', NOW());
```

### "Invalid JWT" 에러

**원인**: 환경변수 오류

**해결**:
1. `.env.local` 확인
2. Supabase URL과 Key가 정확한지 확인
3. 서버 재시작: `bun run dev`

### 로그인 안 됨

```sql
-- 사용자 확인
SELECT id, email FROM auth.users;

-- admin_users 확인
SELECT * FROM admin_users;

-- 사용자가 admin_users에 없으면 추가
INSERT INTO admin_users (id, email, role, confirmed_at)
VALUES ('user-uuid', 'user@example.com', 'master', NOW());
```

---

## 📚 추가 문서

- [이메일 설정 가이드](./SUPABASE_EMAIL_SETTINGS.md) - 이메일 초대 및 SMTP 설정
- [Supabase 공식 문서](https://supabase.com/docs)
- [Next.js + Supabase 가이드](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)

---

## 🆘 지원

문제가 해결되지 않으면:
1. Supabase Dashboard > Logs 확인
2. 브라우저 개발자 도구 Console 확인
3. [Supabase Discord](https://discord.supabase.com) 커뮤니티 문의
