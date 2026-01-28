# 이메일 인증 설정 가이드

Admin 사용자를 초대할 때 실제 이메일 주소로 인증을 받도록 설정하는 방법입니다.

---

## 📧 Supabase 이메일 설정

### 1단계: Email Auth 활성화

1. Supabase Dashboard > **Authentication** > **Providers** 클릭
2. **Email** 섹션에서:
   - **Enable Email provider**: ✅ 체크
   - **Confirm email**: ✅ 체크 (이메일 확인 필수)
   - **Save** 클릭

### 2단계: 이메일 템플릿 수정

1. Supabase Dashboard > **Authentication** > **Email Templates** 클릭
2. **Confirm signup** 템플릿 선택
3. 템플릿 내용 확인/수정:

```html
<h2>Confirm your signup</h2>

<p>Follow this link to confirm your user:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm your mail</a></p>
```

**중요**: `{{ .ConfirmationURL }}`은 Supabase가 자동으로 생성하는 확인 링크입니다.

### 3단계: Redirect URL 설정 (선택사항)

이메일 확인 후 리다이렉트될 URL 설정:

1. Supabase Dashboard > **Authentication** > **URL Configuration** 클릭
2. **Redirect URLs** 섹션에 추가:
   ```
   http://localhost:3000/login
   https://yourdomain.com/login
   ```
3. **Save** 클릭

---

## 📨 SMTP 설정 (선택사항)

Supabase는 기본적으로 자체 이메일 서비스를 사용하지만, 커스텀 SMTP를 설정할 수 있습니다.

### Supabase 기본 이메일
- 개발 환경에서 사용 가능
- 하루 제한: 30통 (무료 플랜)
- 발신자: `noreply@mail.app.supabase.io`

### 커스텀 SMTP 설정 (프로덕션 권장)

1. Supabase Dashboard > **Settings** > **Auth** 클릭
2. **SMTP Settings** 섹션에서:
   - **Enable Custom SMTP**: ✅ 체크
   - **Sender email**: your-email@yourdomain.com
   - **Sender name**: Fashion Gallery Admin
   - **Host**: smtp.gmail.com (Gmail 예시)
   - **Port**: 587
   - **Username**: your-email@gmail.com
   - **Password**: your-app-password
3. **Save** 클릭

#### Gmail 사용 예시
- Host: `smtp.gmail.com`
- Port: `587` (TLS) 또는 `465` (SSL)
- Username: Gmail 주소
- Password: [앱 비밀번호](https://support.google.com/accounts/answer/185833) 생성 필요

---

## 🔄 사용자 초대 플로우 (이메일 인증 후)

### Master가 사용자 초대

1. `/admin/users` 페이지에서 **"+ Invite New User"** 클릭
2. 정보 입력:
   - **Email**: manager@example.com (실제 이메일 주소)
   - **Password**: 임시 비밀번호
   - **Role**: Manager
3. **"Create User"** 클릭

### 초대받은 사용자

1. **이메일 확인**
   - 수신함에서 "Confirm your signup" 이메일 확인
   - **"Confirm your mail"** 링크 클릭

2. **확인 완료**
   - 링크 클릭 시 이메일 확인 완료
   - `/login` 페이지로 리다이렉트 (설정한 경우)

3. **로그인**
   - Email: manager@example.com
   - Password: Master가 설정한 비밀번호
   - 로그인 성공 → `/admin` 대시보드로 이동

---

## ⚠️ 주의사항

### 이메일 확인 전에는 로그인 불가

```
사용자 생성 → 이메일 전송 → 확인 링크 클릭 → 로그인 가능
```

확인하지 않은 사용자가 로그인 시도하면:
```
Error: Email not confirmed
```

### 이메일이 안 오는 경우

1. **스팸 메일함 확인**
2. **Supabase 이메일 로그 확인**
   - Dashboard > **Authentication** > **Logs**
3. **SMTP 설정 확인** (커스텀 SMTP 사용 시)
4. **이메일 전송 제한 확인**
   - 무료 플랜: 하루 30통 제한

---

## 🛠️ 개발 환경에서 테스트

### Supabase 이메일 로그 확인

실제 이메일을 받지 않아도 확인 링크를 얻는 방법:

1. Supabase Dashboard > **Authentication** > **Logs** 클릭
2. 최근 로그에서 `user.created` 이벤트 찾기
3. 로그 상세에서 **확인 링크** 복사
4. 브라우저에서 해당 링크 직접 접속

---

## 🔧 이메일 확인 우회 (개발 환경만)

개발 환경에서 매번 이메일 확인하기 번거로우면:

### 방법 1: email_confirm = true (현재 방식)

```typescript
// API에서 이메일 확인 건너뛰기 (개발 환경만!)
await adminClient.auth.admin.createUser({
  email,
  password,
  email_confirm: true, // 이메일 확인 건너뛰기
});
```

### 방법 2: 환경변수로 분기

```typescript
// 프로덕션에서만 이메일 확인 필수
await adminClient.auth.admin.createUser({
  email,
  password,
  email_confirm: process.env.NODE_ENV === 'development',
});
```

### 방법 3: SQL로 직접 확인 처리

```sql
-- 특정 사용자 이메일 강제 확인
UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE email = 'test@example.com';
```

---

## 📋 체크리스트

### Supabase 설정
- [ ] Email provider 활성화
- [ ] Confirm email 체크
- [ ] Email template 확인
- [ ] Redirect URL 설정
- [ ] SMTP 설정 (선택사항)

### 코드 수정
- [x] API에서 `email_confirm: false` 설정
- [ ] 서버 재시작

### 테스트
- [ ] 실제 이메일 주소로 사용자 생성
- [ ] 이메일 수신 확인
- [ ] 확인 링크 클릭
- [ ] 로그인 테스트

---

## 💡 권장 설정

### 개발 환경
```typescript
email_confirm: true  // 이메일 확인 건너뛰기
```

### 프로덕션 환경
```typescript
email_confirm: false  // 이메일 확인 필수
```
- 커스텀 SMTP 설정 권장
- 실제 도메인 이메일 사용

---

## 🚀 현재 적용된 설정

코드에서 `email_confirm: false`로 변경했으므로:

1. **서버 재시작** 필요:
   ```bash
   bun run dev
   ```

2. **Supabase에서 Email Auth 확인 활성화** 필요:
   - Authentication > Providers > Email > **Confirm email** ✅

3. **테스트**:
   - 실제 이메일 주소로 사용자 초대
   - 이메일 수신 확인
   - 확인 링크 클릭
   - 로그인 시도

이제 실제 이메일 주소만 사용 가능하고, 이메일 확인 후에만 로그인할 수 있습니다!
