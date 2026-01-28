# 사용자 권한 시스템 가이드

Fashion Gallery Admin에는 두 가지 권한 레벨이 있습니다.

## 권한 레벨

### 🔑 Master
**모든 권한 보유**
- ✅ 로그인
- ✅ Archives 관리 (생성/수정/삭제)
- ✅ Pages 관리 (수정)
- ✅ **사용자 관리** (Manager 초대/삭제)

### 👤 Manager
**제한된 권한**
- ✅ 로그인
- ✅ Archives 관리 (생성/수정/삭제)
- ✅ Pages 관리 (수정)
- ❌ 사용자 관리 (접근 불가)

---

## 설정 방법

### 1단계: 기존 Admin을 Master로 업그레이드

Supabase SQL Editor에서 실행:

```sql
-- 기존 admin 사용자를 master로 변경
UPDATE admin_users SET role = 'master' WHERE role = 'admin';

-- role 제약 추가
ALTER TABLE admin_users
DROP CONSTRAINT IF EXISTS admin_users_role_check;

ALTER TABLE admin_users
ADD CONSTRAINT admin_users_role_check
CHECK (role IN ('master', 'manager'));

-- 확인
SELECT id, email, role, created_at FROM admin_users;
```

또는 `scripts/add-user-roles.sql` 파일을 실행하세요.

### 2단계: 새로운 Manager 초대

1. Master 계정으로 로그인
2. Admin > **Users** 메뉴 클릭 (Master만 보임)
3. **"+ Invite New User"** 클릭
4. 정보 입력:
   - Email: 새 사용자 이메일
   - Password: 초기 비밀번호 (최소 6자)
   - Role: **Manager** 선택
5. **"Create User"** 클릭

---

## 사용자 관리

### Master만 가능한 기능

#### 사용자 초대
- `/admin/users` 페이지에서 새 Manager 초대
- Manager는 다른 사용자를 초대할 수 없음

#### 사용자 삭제
- 본인을 제외한 모든 사용자 삭제 가능
- **단, 마지막 Master는 삭제 불가** (최소 1명의 Master 필요)

### Manager 제한사항

- `/admin/users` 페이지 접근 불가
- Admin Sidebar에 "Users" 메뉴 표시 안 됨
- 다른 사용자 정보 조회 불가

---

## API 권한

### 모든 사용자 가능
```
GET  /api/admin/archives
POST /api/admin/archives
PUT  /api/admin/archives/:id
DELETE /api/admin/archives/:id

GET  /api/admin/pages/:id
PUT  /api/admin/pages/:id

POST /api/admin/upload
DELETE /api/admin/upload
```

### Master만 가능
```
GET    /api/admin/users          # 사용자 목록 조회
POST   /api/admin/users          # 사용자 초대
DELETE /api/admin/users/:id      # 사용자 삭제
```

---

## 보안 규칙

### 1. 자기 자신 삭제 불가
```typescript
// 자기 자신은 삭제할 수 없음
if (user.id === targetUserId) {
  return error('Cannot delete your own account');
}
```

### 2. 마지막 Master 삭제 불가
```typescript
// 마지막 Master는 삭제할 수 없음
const masterCount = await getMasterCount();
if (targetUser.role === 'master' && masterCount <= 1) {
  return error('Cannot delete the last master user');
}
```

### 3. Manager는 사용자 관리 불가
```typescript
// Manager는 /api/admin/users 접근 불가
if (currentUser.role !== 'master') {
  return error('Permission denied');
}
```

---

## 문제 해결

### Manager가 Users 메뉴를 볼 수 없어요
✅ **정상입니다.** Manager는 Users 메뉴에 접근할 수 없습니다.

### Master가 본인을 삭제할 수 없어요
✅ **정상입니다.** 자기 자신은 삭제할 수 없습니다.

### 마지막 Master를 삭제할 수 없어요
✅ **정상입니다.** 최소 1명의 Master는 항상 유지되어야 합니다.

### Master를 더 추가하고 싶어요
1. `/admin/users` 페이지에서 **"+ Invite New User"** 클릭
2. Role에서 **"Master"** 선택
3. 사용자 생성

---

## 역할 변경

기존 사용자의 역할을 변경하려면 Supabase SQL Editor에서:

```sql
-- Manager를 Master로 승격
UPDATE admin_users
SET role = 'master'
WHERE email = 'user@example.com';

-- Master를 Manager로 강등
UPDATE admin_users
SET role = 'manager'
WHERE email = 'user@example.com';

-- 확인
SELECT email, role FROM admin_users;
```

**주의**: 마지막 Master를 Manager로 변경하면 아무도 사용자 관리를 할 수 없게 됩니다!

---

## 권한 확인

현재 사용자의 권한을 확인하려면:

```sql
-- 모든 사용자와 권한 조회
SELECT
  email,
  role,
  CASE
    WHEN role = 'master' THEN '모든 권한'
    WHEN role = 'manager' THEN '제한된 권한'
  END as permissions,
  created_at
FROM admin_users
ORDER BY
  CASE role
    WHEN 'master' THEN 1
    WHEN 'manager' THEN 2
  END,
  created_at;
```

---

## 요약

| 기능 | Master | Manager |
|-----|--------|---------|
| 로그인 | ✅ | ✅ |
| Archives 관리 | ✅ | ✅ |
| Pages 관리 | ✅ | ✅ |
| **사용자 초대** | ✅ | ❌ |
| **사용자 삭제** | ✅ | ❌ |
| **Users 메뉴 표시** | ✅ | ❌ |

Manager는 콘텐츠 관리만 가능하고, 시스템 관리는 Master만 가능합니다.
