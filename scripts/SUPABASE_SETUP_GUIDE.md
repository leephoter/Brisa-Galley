# Fashion Gallery - Supabase 설정 가이드

이 가이드는 처음부터 Supabase를 설정하는 전체 과정을 설명합니다.

## 📋 준비사항

- Supabase 계정 (https://supabase.com)
- `.env.local` 파일 준비

---

## 🚀 설정 단계

### 1️⃣ Supabase 프로젝트 생성

1. https://supabase.com 접속 및 로그인
2. **"New Project"** 클릭
3. 프로젝트 정보 입력:
   - **Name**: fashion-gallery (또는 원하는 이름)
   - **Database Password**: 안전한 비밀번호 설정 (저장 필수!)
   - **Region**: Seoul (Northeast Asia)
   - **Pricing Plan**: Free
4. **"Create new project"** 클릭 (약 2분 소요)

---

### 2️⃣ 환경변수 설정

프로젝트 생성 완료 후:

1. Supabase Dashboard > **Settings** > **API**로 이동
2. 다음 값들을 복사:
   - **Project URL**
   - **anon public** key
   - **service_role** key (보안 주의!)

3. 프로젝트 루트에 `.env.local` 파일 생성:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_KEY=your-service-role-key-here
```

---

### 3️⃣ 데이터베이스 설정

1. Supabase Dashboard > **SQL Editor** 클릭
2. **"New query"** 클릭
3. `scripts/supabase-setup.sql` 파일의 전체 내용을 복사하여 붙여넣기
4. **"Run"** 버튼 클릭 (또는 Cmd/Ctrl + Enter)
5. 성공 메시지 확인

**생성되는 것들:**
- ✅ `archives` 테이블 (display_order, label 포함)
- ✅ `pages` 테이블 (place, news, call)
- ✅ `admin_users` 테이블
- ✅ 모든 인덱스
- ✅ RLS 정책
- ✅ 초기 데이터 (3개 pages)

---

### 4️⃣ Storage 버킷 생성

1. Supabase Dashboard > **Storage** 클릭
2. **"Create a new bucket"** 클릭
3. 버킷 정보 입력:
   - **Name**: `archive-images`
   - **Public bucket**: ✅ 체크
   - **File size limit**: 10 MB (선택사항)
   - **Allowed MIME types**: image/* (선택사항)
4. **"Create bucket"** 클릭

---

### 5️⃣ Storage 정책 설정

#### 방법 1: SQL Editor 사용 (권장)

1. SQL Editor에서 새 쿼리 생성
2. 다음 SQL 실행:

```sql
-- Policy 1: Anyone can view archive images
CREATE POLICY "Anyone can view archive images"
ON storage.objects FOR SELECT
USING (bucket_id = 'archive-images');

-- Policy 2: Admins can upload archive images
CREATE POLICY "Admins can upload archive images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'archive-images'
  AND EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.id = auth.uid()
  )
);

-- Policy 3: Admins can update archive images
CREATE POLICY "Admins can update archive images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'archive-images'
  AND EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.id = auth.uid()
  )
);

-- Policy 4: Admins can delete archive images
CREATE POLICY "Admins can delete archive images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'archive-images'
  AND EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.id = auth.uid()
  )
);
```

#### 방법 2: UI 사용

1. Storage > archive-images > **Policies** 탭
2. 각 정책을 UI에서 수동으로 추가 (세미콜론 제거 필요)

---

### 6️⃣ 첫 번째 관리자 계정 생성

#### A. Supabase Auth에서 사용자 생성

1. Authentication > **Users** 클릭
2. **"Invite user"** 또는 **"Add user"** 클릭
3. 정보 입력:
   - **Email**: admin@yourdomain.com
   - **Password**: 안전한 비밀번호
   - **Auto Confirm User**: ✅ 체크 (이메일 확인 건너뛰기)
4. **"Create user"** 클릭
5. 생성된 사용자의 **User ID** 복사 (UUID 형식)

#### B. admin_users 테이블에 추가

SQL Editor에서 실행 (User ID와 Email을 실제 값으로 변경):

```sql
INSERT INTO admin_users (id, email, role)
VALUES ('YOUR-USER-ID-HERE', 'admin@yourdomain.com', 'admin');
```

#### C. 확인

```sql
SELECT * FROM admin_users;
```

결과에 방금 추가한 관리자가 표시되어야 합니다.

---

### 7️⃣ Next.js 이미지 설정

`next.config.ts` 파일에 Supabase 호스트 추가:

```typescript
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'your-project.supabase.co', // 실제 프로젝트 URL의 호스트명
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};
```

---

### 8️⃣ 개발 서버 실행 및 테스트

```bash
# 서버 실행
bun run dev

# 브라우저에서 접속
open http://localhost:3000/login
```

#### 로그인 테스트
1. 6단계에서 생성한 계정으로 로그인
2. `/admin` 대시보드로 리다이렉트 확인
3. 왼쪽 사이드바에서 **Archives**, **Pages** 메뉴 확인

---

## ✅ 설정 검증

### 데이터베이스 검증

SQL Editor에서 실행:

```sql
-- 테이블 확인
SELECT 'archives' as table_name, COUNT(*) as row_count FROM archives
UNION ALL
SELECT 'pages', COUNT(*) FROM pages
UNION ALL
SELECT 'admin_users', COUNT(*) FROM admin_users;

-- 결과 예상:
-- archives: 0 (아직 생성 전)
-- pages: 3 (place, news, call)
-- admin_users: 1 (방금 생성한 관리자)
```

### 인덱스 확인

```sql
SELECT tablename, indexname
FROM pg_indexes
WHERE tablename IN ('archives', 'pages', 'admin_users')
ORDER BY tablename, indexname;
```

### RLS 정책 확인

```sql
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE tablename IN ('archives', 'pages', 'admin_users')
ORDER BY tablename, policyname;
```

---

## 📝 기능 테스트

### 1. Archives 관리
- **생성**: `/admin/archives` > "Create New Archive"
- **이미지 업로드**: 드래그 앤 드롭으로 이미지 추가
- **순서 변경**: 목록에서 드래그 앤 드롭으로 순서 변경
- **수정**: "Edit" 버튼으로 제목, 시즌, 라벨 수정
- **삭제**: "Delete" 버튼으로 삭제

### 2. Pages 관리
- **수정**: `/admin/pages` > Place/News/Call 중 하나 선택 > "Edit"
- **Label 변경**: Header 메뉴에 표시될 이름 변경
- **공개/비공개**: 체크박스로 Header 메뉴 표시/숨김 제어

### 3. 앱에서 확인
- **Header 메뉴**: 추가한 Archives가 ARCHIVE 드롭다운에 표시되는지 확인
- **Pages 메뉴**: PLACE, NEWS, CALL 메뉴 클릭 시 페이지 이동 확인
- **Archive 상세**: Archive 클릭 시 이미지들이 정상 표시되는지 확인

---

## 🔧 문제 해결

### 로그인이 안 돼요
- admin_users 테이블에 사용자가 추가되었는지 확인
- 이메일/비밀번호가 정확한지 확인
- 브라우저 콘솔(F12)에서 에러 메시지 확인

### 이미지 업로드가 안 돼요
- `archive-images` 버킷이 Public으로 설정되었는지 확인
- Storage 정책이 모두 추가되었는지 확인
- 파일 크기가 10MB 이하인지 확인

### Header에 메뉴가 안 보여요
- Archives: `is_published`가 true인지 확인
- Pages: `is_published`가 true인지 확인
- 브라우저 새로고침 (Cmd/Ctrl + Shift + R)

### 드래그 앤 드롭 순서가 저장 안 돼요
- `display_order` 컬럼이 존재하는지 확인
- 브라우저 콘솔에서 에러 메시지 확인
- 서버를 재시작해보세요

---

## 📦 선택사항: 정적 데이터 마이그레이션

기존 `src/lib/data.ts`에 정적 데이터가 있다면:

```bash
bun run scripts/migrate-archives.ts
```

---

## 🎉 설정 완료!

이제 Fashion Gallery 어드민 시스템을 사용할 수 있습니다.

**주요 URL:**
- 로그인: http://localhost:3000/login
- 대시보드: http://localhost:3000/admin
- Archives 관리: http://localhost:3000/admin/archives
- Pages 관리: http://localhost:3000/admin/pages

**문제가 발생하면:**
1. 브라우저 콘솔(F12) 확인
2. 터미널 로그 확인
3. Supabase Dashboard > Logs 확인
