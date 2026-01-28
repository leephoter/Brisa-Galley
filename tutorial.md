🔧 1단계: Supabase 설정 (처음 한 번만)

1.1 Supabase 프로젝트 생성

1. https://supabase.com 접속 후 로그인
2. "New Project" 클릭
3. 프로젝트 정보 입력:

- Name: fashion-gallery
- Database Password: 안전한 비밀번호 입력 (꼭 저장!)
- Region: Seoul (또는 가까운 지역)

4. "Create new project" 클릭 (1-2분 소요)

1.2 데이터베이스 설정

1. Supabase 대시보드에서 SQL Editor 메뉴 선택
2. "New query" 클릭
3. 프로젝트의 scripts/supabase-setup.sql 파일 내용 복사
4. SQL 에디터에 붙여넣기
5. "Run" 버튼 클릭

1.3 이미지 저장소 생성

1. Storage 메뉴 선택
2. "Create a new bucket" 클릭
3. 버킷 정보 입력:

- Name: archive-images
- Public bucket: ✅ 체크 (이미지를 웹에서 볼 수 있게)

4. "Create bucket" 클릭

1.4 저장소 권한 설정

archive-images 버킷의 Policies 탭에서 3개의 정책 추가:

정책 1: 누구나 이미지 조회
bucket_id = 'archive-images'

정책 2: 어드민만 업로드
bucket_id = 'archive-images'
AND EXISTS (
SELECT 1 FROM admin_users
WHERE admin_users.id = auth.uid()
)

정책 3: 어드민만 삭제
bucket_id = 'archive-images'
AND EXISTS (
SELECT 1 FROM admin_users
WHERE admin_users.id = auth.uid()
)

1.5 관리자 계정 생성

1. Authentication > Users 메뉴
2. "Add user" > "Create new user" 클릭
3. 이메일과 비밀번호 입력
4. "Create user" 클릭
5. 생성된 사용자의 ID 복사 (UUID 형식)

1.6 관리자 권한 부여???

SQL Editor에서 실행 (ID와 이메일을 본인 것으로 변경):
INSERT INTO admin_users (id, email, role)
VALUES ('복사한-사용자-ID', 'your-email@example.com', 'admin');

1.7 환경 변수 설정

1. Supabase 대시보드에서 Settings > API 메뉴
2. 다음 값들을 복사:

- Project URL
- anon public key
- service_role key

3. 프로젝트 루트의 .env.local 파일 수정:
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=복사한-anon-key
   SUPABASE_SERVICE_KEY=복사한-service-role-key

1.8 설정 검증

bun run verify:setup

모든 항목에 ✅가 나오면 성공!

---

🚀 2단계: 어드민 페이지 접속

개발 서버 실행

bun run dev

로그인

1. 브라우저에서 http://localhost:3000/admin/login 접속
2. 생성한 이메일과 비밀번호 입력
3. "Login" 버튼 클릭

성공하면 대시보드 페이지로 이동합니다!

---

📸 3단계: Archive 관리하기

3.1 Archive 생성하기

1. 왼쪽 사이드바에서 "Archives" 클릭
2. 오른쪽 상단 "+ Create New Archive" 버튼 클릭
3. 기본 정보 입력:

4. Season (시즌) 필수

- SPRING / SUMMER 또는 FALL / WINTER 선택

Year (년도) 필수

- 예: 2026

Title (제목) 필수

- 예: 2026 SS

Slug (URL 주소) 필수

- URL에 사용될 고유 식별자
- 소문자, 숫자, 하이픈(-)만 사용
- 예: 2026-ss

Description (설명) 선택

- Archive에 대한 설명 (선택사항)

4. 이미지 업로드:

5. 방법 1: 드래그 앤 드롭

- 파일 탐색기에서 이미지 파일들을 선택
- 업로드 영역으로 드래그해서 놓기
- 여러 개 동시 업로드 가능 (최대 80개)

방법 2: 파일 선택

- 업로드 영역 클릭
- 파일 선택 창에서 이미지 선택
- Ctrl(Cmd) 키로 여러 개 선택 가능

지원 형식: JPG, PNG, WebP (각 최대 10MB) 5. 이미지 순서 조정:

- 업로드된 이미지를 드래그해서 순서 변경
- 왼쪽 → 오른쪽, 위 → 아래 순서로 표시됨

6. "Create Archive" 버튼 클릭

완료! Archives 목록으로 돌아갑니다.

3.2 Archive 수정하기

1. Archives 목록에서 수정할 Archive의 "Edit" 버튼 클릭
2. 정보 수정:

- 시즌, 년도, 제목, 설명 등 수정 가능
- Slug는 신중하게 변경 (URL이 바뀜)

3. 이미지 추가:

- 새로운 이미지를 드래그 앤 드롭으로 추가
- 기존 이미지는 그대로 유지됨

4. 이미지 삭제:

- 각 이미지 위에 마우스를 올리면 "×" 버튼 나타남
- 클릭해서 삭제 (확인 메시지 나옴)

5. 이미지 순서 변경:

- 이미지를 드래그해서 원하는 위치로 이동

6. "Update Archive" 버튼 클릭

3.3 Archive 삭제하기

1. Archives 목록에서 삭제할 Archive의 "Delete" 버튼 클릭
2. 확인 메시지에서 "확인" 클릭
3. Archive와 함께 모든 이미지도 자동 삭제됨 (주의!)

---

🎨 4단계: 프론트엔드에서 확인

Archive를 생성/수정하면 자동으로 프론트엔드에 반영됩니다:

Archive 목록 확인

http://localhost:3000/archive

특정 Archive 확인

http://localhost:3000/archive/2026-ss
(slug 값에 따라 URL이 결정됨)

---

💡 주요 기능 설명

대시보드 (/admin)

- Archives 개수 확인
- 최근 생성된 Archive 5개 표시
- 빠른 접근 링크

Archives 목록 (/admin/archives)

- 모든 Archive 목록 보기
- 각 Archive의:
- 제목, 시즌, 년도
- 이미지 개수
- 공개 상태
- URL 주소 (slug)
- Edit/Delete 버튼

Archive 생성 (/admin/archives/new)

- 새 Archive 만들기
- 모든 필드 입력
- 이미지 업로드

Archive 수정 (/admin/archives/[id])

- 기존 Archive 수정
- 이미지 추가/삭제/순서변경

---

🔍 팁과 노하우

이미지 업로드 팁

1. 한 번에 여러 개 업로드: Ctrl(Cmd) 키로 여러 파일 선택
2. 폴더째 드래그: 폴더를 드래그하면 안의 모든 이미지 업로드
3. 업로드 중 기다리기: 큰 이미지는 시간이 걸릴 수 있음 (진행률 표시됨)

Slug 작성 팁

- 일관성: 2026-ss, 2026-fw, 2025-ss 같은 패턴 유지
- 간결하게: 짧고 명확하게
- 변경 주의: Slug를 바꾸면 URL이 바뀌어 기존 링크가 깨질 수 있음

이미지 순서 팁

- 중요한 이미지 먼저: 대표 이미지를 가장 앞에
- 스토리텔링: 컬렉션의 흐름을 고려해서 배치
- 드래그로 쉽게 변경: 언제든 순서 조정 가능

워크플로우 추천

1. 기본 정보 먼저 입력 (특히 Slug)
2. 모든 이미지 한 번에 업로드
3. 업로드 완료 후 순서 조정
4. 미리보기로 확인
5. 저장

---

🚨 주의사항

삭제는 되돌릴 수 없음

- Archive를 삭제하면 복구 불가능
- 모든 이미지도 함께 삭제됨
- 삭제 전 꼭 확인!

Slug는 고유해야 함

- 같은 slug를 가진 Archive는 만들 수 없음
- 이미 사용 중인 slug를 입력하면 에러 발생

로그아웃 잊지 말기

- 작업 완료 후 오른쪽 상단 "Logout" 버튼 클릭
- 특히 공용 컴퓨터 사용 시!

---

❓ 자주 묻는 질문

Q: 로그인이 안 돼요

A:

1. 이메일/비밀번호 확인
2. Supabase Authentication에 사용자가 있는지 확인
3. admin_users 테이블에 추가했는지 확인
   SELECT \* FROM admin_users WHERE email = 'your-email';

Q: 이미지 업로드가 안 돼요

A:

1. 파일 크기 확인 (10MB 이하)
2. 파일 형식 확인 (JPG, PNG, WebP만)
3. 저장소 버킷이 public인지 확인
4. 저장소 정책이 설정되었는지 확인

Q: 프론트에 안 나와요

A:

1. 브라우저 캐시 삭제 후 새로고침
2. is_published가 true인지 확인
   SELECT title, is_published FROM archives;

Q: 이미지가 너무 커요

A:

- 업로드 전에 이미지 리사이즈 권장
- 웹용: 1920px 너비 권장
- JPG 품질 80-90% 권장

---

📞 도움 받기

문제가 생기면:

1. 개발자 콘솔 확인 (F12)

- 에러 메시지 확인

2. Supabase 로그 확인

- Supabase 대시보드 > Logs

3. 설정 재확인
   bun run verify:setup

4. 문서 참고

- ADMIN_SETUP.md - 상세 설정 가이드
- ADMIN_QUICK_START.md - 빠른 참조

---

🎉 이제 시작하세요!

1. ✅ Supabase 설정 완료
2. ✅ 관리자 계정 생성
3. ✅ 로그인 성공
4. ✅ Archive 만들기
5. ✅ 이미지 업로드
6. ✅ 프론트엔드 확인

첫 Archive를 만들어보세요! 🚀

# 개발 서버 실행

bun run dev

# 브라우저에서

http://localhost:3000/admin/login
