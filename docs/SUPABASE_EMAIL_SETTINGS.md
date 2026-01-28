# Supabase 이메일 설정 가이드

개발 환경에서 이메일 전송 없이 테스트하거나, 프로덕션에서 실제 이메일을 전송하는 방법입니다.

---

## 🚀 빠른 해결 (개발 환경)

### 이메일 확인 건너뛰기 설정 완료 ✅

코드가 다음과 같이 설정되어 있으면 개발 환경에서는 이메일 확인이 자동으로 건너뛰어집니다:

```typescript
email_confirm: process.env.NODE_ENV === 'development'
```

**서버 재시작 후 바로 사용 가능합니다:**

```bash
# Ctrl + C로 중지 후
bun run dev
```

이제 개발 환경에서는:
- ✅ 가짜 이메일 주소 사용 가능 (`test@test.com`)
- ✅ 이메일 확인 없이 즉시 로그인 가능

---

## 📧 Supabase 이메일 전송 설정 (프로덕션용)

프로덕션 환경에서 실제 이메일을 전송하려면:

### 1단계: Email Provider 활성화

1. **Supabase Dashboard** 로그인
2. **Authentication** > **Providers** 클릭
3. **Email** 섹션:
   - ✅ **Enable Email provider** 체크
   - ✅ **Confirm email** 체크 (이메일 확인 필수로 설정)
   - **Save** 클릭

### 2단계: Site URL 설정

1. **Authentication** > **URL Configuration** 클릭
2. **Site URL** 설정:
   ```
   https://yourdomain.com
   ```
3. **Redirect URLs** 추가:
   ```
   https://yourdomain.com/login
   http://localhost:3000/login
   ```
4. **Save** 클릭

### 3단계: Email Templates 확인

1. **Authentication** > **Email Templates** 클릭
2. **Confirm signup** 템플릿 선택
3. 내용 확인 (기본 템플릿으로도 충분):

```html
<h2>Confirm your signup</h2>
<p>Follow this link to confirm your user:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm your mail</a></p>
```

---

## 📨 Supabase 기본 이메일 vs 커스텀 SMTP

### Supabase 기본 이메일 서비스

**무료 플랜 제한:**
- 시간당 3통
- 하루 30통
- 발신자: `noreply@mail.app.supabase.io`

**장점:**
- 설정 불필요
- 즉시 사용 가능

**단점:**
- 발송 제한 있음
- 스팸으로 분류될 수 있음
- 커스텀 발신자 불가

### 커스텀 SMTP (권장 - 프로덕션)

**장점:**
- 발송 제한 없음 (SMTP 서비스 기준)
- 커스텀 발신자 설정 가능
- 브랜딩 가능

**설정 방법:**

1. **Settings** > **Auth** > **SMTP Settings** 클릭
2. **Enable Custom SMTP** ✅ 체크
3. SMTP 정보 입력:

#### Gmail 예시
```
Sender email: noreply@yourdomain.com
Sender name: Fashion Gallery Admin
Host: smtp.gmail.com
Port: 587
Username: your-email@gmail.com
Password: [앱 비밀번호]
```

#### Gmail 앱 비밀번호 생성
1. Google 계정 설정 > 보안
2. 2단계 인증 활성화
3. 앱 비밀번호 생성: https://myaccount.google.com/apppasswords
4. "메일" 앱 선택 > 비밀번호 생성
5. 생성된 16자리 비밀번호 복사

#### SendGrid 예시
```
Host: smtp.sendgrid.net
Port: 587
Username: apikey
Password: [SendGrid API Key]
```

#### AWS SES 예시
```
Host: email-smtp.us-east-1.amazonaws.com
Port: 587
Username: [SMTP Username]
Password: [SMTP Password]
```

---

## 🧪 이메일 전송 테스트

### 1. 사용자 초대

1. `/admin/users` 접속
2. **"+ Invite New User"** 클릭
3. **실제 이메일 주소** 입력
4. Password, Role 입력
5. **"Create User"** 클릭

### 2. 이메일 확인

**이메일이 왔다면:**
- ✅ SMTP 설정 성공
- 확인 링크 클릭 → 로그인 가능

**이메일이 안 왔다면:**
1. **스팸 메일함** 확인
2. **Supabase 로그** 확인 (아래 참조)
3. **SMTP 설정** 재확인
4. **이메일 발송 제한** 확인

### 3. Supabase 로그에서 확인 링크 찾기

이메일이 안 와도 확인 링크를 직접 얻을 수 있습니다:

1. **Authentication** > **Logs** 클릭
2. 최근 로그에서 `signup` 또는 `user.created` 이벤트 찾기
3. 로그 상세 보기 > **Confirmation URL** 복사
4. 브라우저에서 해당 URL 직접 접속
5. 이메일 확인 완료!

---

## 🔍 이메일이 안 오는 경우 디버깅

### 체크리스트

1. **Email Provider 활성화 확인**
   - Authentication > Providers > Email > Enable ✅

2. **Confirm email 설정 확인**
   - Authentication > Providers > Email > Confirm email ✅

3. **코드에서 email_confirm 확인**
   ```typescript
   // 프로덕션에서는 false여야 이메일 전송
   email_confirm: process.env.NODE_ENV === 'development'
   ```

4. **Supabase 로그 확인**
   - Authentication > Logs
   - 에러 메시지 확인

5. **발송 제한 확인**
   - 무료 플랜: 시간당 3통, 하루 30통
   - 초과 시 SMTP 설정 필요

6. **SMTP 자격증명 확인** (커스텀 SMTP 사용 시)
   - Username/Password 정확한지 확인
   - Gmail: 앱 비밀번호 사용 (일반 비밀번호 X)

---

## 💡 환경별 권장 설정

### 로컬 개발 환경

```typescript
// src/app/api/admin/users/route.ts
email_confirm: process.env.NODE_ENV === 'development'  // true
```

**결과:**
- 이메일 확인 건너뛰기
- 가짜 이메일 사용 가능
- 즉시 로그인 가능

### 스테이징/프로덕션 환경

```typescript
email_confirm: process.env.NODE_ENV === 'development'  // false
```

**Supabase 설정:**
- Email Provider 활성화 ✅
- Confirm email 활성화 ✅
- 커스텀 SMTP 설정 (권장)

**결과:**
- 실제 이메일 주소만 가능
- 확인 이메일 전송
- 확인 후 로그인 가능

---

## 🎯 현재 상태 확인

```bash
# 환경 확인
echo $NODE_ENV

# development → 이메일 확인 건너뛰기
# production → 이메일 확인 필수
```

---

## 📝 빠른 참조

| 환경 | email_confirm | 이메일 전송 | 가짜 이메일 | 즉시 로그인 |
|------|---------------|-------------|-------------|-------------|
| 개발 (localhost) | `true` | ❌ | ✅ | ✅ |
| 프로덕션 (배포) | `false` | ✅ | ❌ | ❌ (확인 후) |

---

## 🆘 문제 해결

### "Email not confirmed" 에러

**원인:** 이메일 확인을 하지 않음

**해결:**
1. 이메일에서 확인 링크 클릭
2. 또는 Supabase 로그에서 확인 링크 찾기
3. 또는 SQL로 강제 확인:
   ```sql
   UPDATE auth.users
   SET email_confirmed_at = NOW()
   WHERE email = 'user@example.com';
   ```

### 이메일이 계속 안 와요

**임시 해결 (개발 환경):**
```typescript
// 개발 중에는 이메일 확인 건너뛰기
email_confirm: true
```

**장기 해결 (프로덕션):**
- 커스텀 SMTP 설정
- SendGrid, AWS SES, Gmail 등 사용

---

현재 코드는 **개발 환경에서 자동으로 이메일 확인을 건너뛰도록** 설정되어 있습니다.

**서버만 재시작하면 바로 사용 가능합니다!** 🚀
