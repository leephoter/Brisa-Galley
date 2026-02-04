import { UserRole } from '@/types';

/**
 * 권한 정의
 */
export const PERMISSIONS = {
  // 모든 사용자가 가능
  LOGIN: ['master', 'manager'],
  VIEW_DASHBOARD: ['master', 'manager'],

  // Admin 설정 (Archives, Pages 관리)
  MANAGE_ARCHIVES: ['master', 'manager'],
  MANAGE_PAGES: ['master', 'manager'],

  // 사용자 관리 (master만 가능)
  MANAGE_USERS: ['master'],
  INVITE_USERS: ['master'],
  DELETE_USERS: ['master'],
} as const;

/**
 * 역할에 따른 설명 반환
 */
export function getRoleDescription(role: UserRole): string {
  switch (role) {
    case 'master':
      return '모든 권한 (로그인, 계정 관리, Admin 설정)';
    case 'manager':
      return '제한된 권한 (로그인, Admin 설정만)';
    default:
      return '알 수 없는 역할';
  }
}

/**
 * 역할에 따른 레이블 반환
 */
export function getRoleLabel(role: UserRole): string {
  switch (role) {
    case 'master':
      return 'Master';
    case 'manager':
      return 'Manager';
    default:
      return role;
  }
}
