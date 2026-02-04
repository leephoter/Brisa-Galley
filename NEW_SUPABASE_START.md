1단계: 새 Supabase 프로젝트 생성

1. https://supabase.com 접속
2. "New Project" 클릭
3. 프로젝트 이름, 데이터베이스 비밀번호 설정
4. Region 선택 (Seoul 권장)
5. 생성 완료 대기 (약 2분)

2단계: 데이터베이스 테이블 생성

Supabase Dashboard > SQL Editor에서 다음 쿼리를 순서대로 실행:

A. admin_users 테이블

-- admin_users 테이블 생성
CREATE TABLE admin_users (
id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
email VARCHAR(255) UNIQUE NOT NULL,
role VARCHAR(20) DEFAULT 'manager',
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
confirmed_at TIMESTAMP WITH TIME ZONE
);

-- RLS 활성화
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- 정책: 자기 자신만 조회 가능
CREATE POLICY "Admins can view themselves"
ON admin_users FOR SELECT
USING (auth.uid() = id);

-- 인덱스 생성
CREATE INDEX idx_admin_users_email ON admin_users(email);

B. archives 테이블

-- archives 테이블 생성
CREATE TABLE archives (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
season VARCHAR(50) NOT NULL,
year INTEGER NOT NULL,
title VARCHAR(200) NOT NULL,
label VARCHAR(200),
description TEXT,
slug VARCHAR(200) UNIQUE NOT NULL,
image_order TEXT[],
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
created_by UUID REFERENCES auth.users(id),
is_published BOOLEAN DEFAULT true,
display_order INTEGER DEFAULT 0
);

-- RLS 활성화
ALTER TABLE archives ENABLE ROW LEVEL SECURITY;

-- 정책: 누구나 published archives 조회 가능
CREATE POLICY "Anyone can view published archives"
ON archives FOR SELECT
USING (is_published = true);

-- 정책: 어드민만 모든 작업 가능
CREATE POLICY "Admins can do everything on archives"
ON archives FOR ALL
USING (
EXISTS (
SELECT 1 FROM admin_users
WHERE admin_users.id = auth.uid()
)
);

-- 인덱스 생성
CREATE INDEX idx_archives_slug ON archives(slug);
CREATE INDEX idx_archives_year ON archives(year DESC);
CREATE INDEX idx_archives_display_order ON archives(display_order);
CREATE INDEX idx_archives_is_published ON archives(is_published);

C. pages 테이블

-- pages 테이블 생성
CREATE TABLE pages (
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

-- RLS 활성화
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

-- 정책: 누구나 published pages 조회 가능
CREATE POLICY "Anyone can view published pages"
ON pages FOR SELECT
USING (is_published = true);

-- 정책: 어드민만 모든 작업 가능
CREATE POLICY "Admins can do everything on pages"
ON pages FOR ALL
USING (
EXISTS (
SELECT 1 FROM admin_users
WHERE admin_users.id = auth.uid()
)
);

-- 인덱스 생성
CREATE INDEX idx_pages_page_key ON pages(page_key);
CREATE INDEX idx_pages_slug ON pages(slug);
CREATE INDEX idx_pages_display_order ON pages(display_order);

-- 기본 페이지 데이터 삽입
INSERT INTO pages (page_key, title, label, slug, display_order) VALUES
('place', 'PLACE', 'PLACE', 'place', 1),
('news', 'NEWS', 'NEWS', 'news', 2),
('call', 'CALL', 'CALL', 'call', 3);

3단계: Storage Bucket 생성 및 정책 설정

A. Bucket 생성

1. Supabase Dashboard > Storage
2. "Create a new bucket" 클릭
3. Name: brisa-images
4. Public bucket: 체크
5. File size limit: 50MB (Free tier) 또는 더 높게 설정
6. "Create bucket" 클릭

B. Storage RLS 정책

SQL Editor에서 실행:

-- 1. 누구나 이미지 조회 가능
CREATE POLICY "Anyone can view archive images"
ON storage.objects FOR SELECT
USING (bucket_id = 'brisa-images');

-- 2. 어드민만 이미지 업로드 가능
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
CREATE POLICY "Admins can update archive images"
ON storage.objects FOR UPDATE
USING (
bucket_id = 'brisa-images'
AND EXISTS (
SELECT 1 FROM admin_users
WHERE admin_users.id = auth.uid()
)
);

4단계: Authentication 설정

A. Email Provider 활성화

1. Supabase Dashboard > Authentication > Providers
2. Email 확인 (기본 활성화됨)
3. Confirm email 설정: 개발 중이면 OFF, 프로덕션이면 ON

B. Site URL 설정

1. Authentication > URL Configuration
2. Site URL: https://your-domain.com (배포 도메인)
3. Redirect URLs 추가:

- http://localhost:3000/\*\*
- https://your-domain.com/**

5단계: 첫 어드민 사용자 생성

A. Authentication에서 사용자 생성

1. Authentication > Users > "Add user"
2. Email: 사용할 이메일 주소
3. Password: 안전한 비밀번호
4. Auto Confirm User: 체크 (이메일 확인 스킵)
5. "Create user" 클릭
6. 생성된 User ID 복사 (UUID 형식)

B. admin_users에 추가

SQL Editor에서:

INSERT INTO admin_users (id, email, role, confirmed_at)
VALUES (
'위에서-복사한-UUID',
'admin@example.com',
'master',
NOW()
);

6단계: 환경변수 설정

A. Supabase 프로젝트 정보 확인

Supabase Dashboard > Settings > API:

- Project URL
- anon public key
- service_role key (비밀 유지!)

B. 로컬 환경변수

프로젝트 루트의 .env.local 파일:

NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_KEY=eyJhbGc...

C. Vercel 환경변수 (배포용)

1. Vercel Dashboard > Project > Settings > Environment Variables
2. 다음 3개 추가:

- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_KEY

3. Environment: Production, Preview, Development 모두 체크
4. Save

7단계: 데이터 마이그레이션 (선택사항)

기존 프로젝트에 데이터가 있다면:

A. 기존 데이터 Export

기존 Supabase Dashboard > SQL Editor:

-- Archives 데이터 export
SELECT \* FROM archives;

-- Pages 데이터 export
SELECT \* FROM pages;

-- Admin users 데이터 export
SELECT \* FROM admin_users;

결과를 CSV로 다운로드

B. 새 프로젝트에 Import

Table Editor에서 각 테이블 열고 "Insert" > "Import data from CSV"

또는 SQL로 직접:

-- Archives 예시
INSERT INTO archives (id, season, year, title, slug, image_order, display_order)
VALUES
('uuid1', 'SPRING / SUMMER', 2026, '2026 SS', '2026-ss', '{}', 1),
('uuid2', 'FALL / WINTER', 2026, '2026 FW', '2026-fw', '{}', 2);

8단계: 이미지 마이그레이션 (선택사항)

기존 Storage에 이미지가 있다면:

방법 1: Supabase CLI 사용

# Supabase CLI 설치

npm install -g supabase

# 기존 프로젝트에서 다운로드

supabase storage download brisa-images --all

# 새 프로젝트에 업로드

supabase storage upload brisa-images ./downloaded-images/\*

방법 2: 수동 다운로드/업로드

1. 기존 Supabase Storage에서 이미지 다운로드
2. 새 프로젝트 Storage에 수동 업로드
3. 또는 admin 페이지에서 다시 업로드

9단계: 연결 테스트

A. 로컬 테스트

# 환경변수 확인

cat .env.local

# 개발 서버 시작

bun run dev

# 브라우저에서 확인

# 1. http://localhost:3000 - 메인 페이지

# 2. http://localhost:3000/admin/login - 로그인

# 3. http://localhost:3000/admin/archives - 이미지 업로드 테스트

B. 데이터베이스 연결 확인

SQL Editor:

-- 모든 테이블 확인
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public';

-- 정책 확인
SELECT schemaname, tablename, policyname, cmd
FROM pg_policies
WHERE schemaname IN ('public', 'storage');

-- 데이터 확인
SELECT COUNT(_) FROM admin_users;
SELECT COUNT(_) FROM archives;
SELECT COUNT(\*) FROM pages;

10단계: 배포

# Vercel에 배포

vercel --prod

# 또는 git push로 자동 배포

git add .
git commit -m "Update Supabase project"
git push origin main

전체 체크리스트

마이그레이션 완료 후 확인:

- 새 Supabase 프로젝트 생성 완료
- admin_users 테이블 생성 및 RLS 설정
- archives 테이블 생성 및 RLS 설정
- pages 테이블 생성 및 기본 데이터 삽입
- brisa-images Storage bucket 생성 (Public)
- Storage RLS 정책 4개 생성 (SELECT, INSERT, DELETE, UPDATE)
- Authentication Email Provider 활성화
- 첫 어드민 사용자 생성
- admin_users에 사용자 추가
- .env.local 환경변수 설정
- Vercel 환경변수 설정
- 로컬에서 로그인 테스트
- 로컬에서 이미지 업로드 테스트
- 배포 환경에서 로그인 테스트
- 배포 환경에서 이미지 업로드 테스트

문제 해결

로그인 안 됨

-- 사용자 확인
SELECT _ FROM auth.users;
SELECT _ FROM admin_users;

-- admin_users에 추가 확인
SELECT \* FROM admin_users WHERE id = '사용자-UUID';

이미지 업로드 안 됨

-- Storage 정책 확인
SELECT \* FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';

-- 현재 사용자가 admin인지 확인
SELECT auth.uid(), EXISTS(SELECT 1 FROM admin_users WHERE id = auth.uid());

RLS 에러

-- RLS 활성화 확인
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';

-- 모든 정책 확인
SELECT \* FROM pg_policies WHERE schemaname = 'public';
