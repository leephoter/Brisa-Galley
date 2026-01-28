'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminUser } from '@/types';
import { getRoleLabel, getRoleDescription } from '@/lib/permissions';
import styles from './UserManagement.module.css';

interface UserManagementProps {
  users: AdminUser[];
  currentUserId: string;
}

export default function UserManagement({ users: initialUsers, currentUserId }: UserManagementProps) {
  const router = useRouter();
  const [users, setUsers] = useState(initialUsers);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'manager' as 'master' | 'manager',
  });
  const [error, setError] = useState('');

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create user');
      }

      setUsers([data.data, ...users]);
      setFormData({ email: '', password: '', role: 'manager' });
      setShowInviteForm(false);
      router.refresh();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(userId: string, email: string) {
    if (!confirm(`정말로 "${email}" 사용자를 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.`)) {
      return;
    }

    setDeleting(userId);

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete user');
      }

      setUsers(users.filter(u => u.id !== userId));
      router.refresh();
    } catch (error: any) {
      alert(`삭제 실패: ${error.message}`);
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.actions}>
        <button
          onClick={() => setShowInviteForm(!showInviteForm)}
          className={styles.inviteBtn}
        >
          {showInviteForm ? 'Cancel' : '+ Invite New User'}
        </button>
      </div>

      {showInviteForm && (
        <form onSubmit={handleInvite} className={styles.inviteForm}>
          <h2>Invite New User</h2>

          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.formGroup}>
            <label>
              Email <span className={styles.required}>*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="user@example.com"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>
              Password <span className={styles.required}>*</span>
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
              minLength={6}
              required
            />
            <small>최소 6자 이상</small>
          </div>

          <div className={styles.formGroup}>
            <label>
              Role <span className={styles.required}>*</span>
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as 'master' | 'manager' })}
              required
            >
              <option value="manager">Manager - 제한된 권한 (Admin 설정만)</option>
              <option value="master">Master - 모든 권한 (계정 관리 포함)</option>
            </select>
            <small>{getRoleDescription(formData.role)}</small>
          </div>

          <button type="submit" disabled={loading} className={styles.submitBtn}>
            {loading ? 'Creating...' : 'Create User'}
          </button>
        </form>
      )}

      <div className={styles.userList}>
        <h2>Admin Users ({users.length})</h2>

        {users.length === 0 ? (
          <div className={styles.empty}>
            <p>No users found.</p>
          </div>
        ) : (
          <div className={styles.list}>
            {users.map((user) => {
              const isCurrentUser = user.id === currentUserId;
              const masterCount = users.filter(u => u.role === 'master').length;
              const isLastMaster = user.role === 'master' && masterCount === 1;

              return (
                <div key={user.id} className={styles.userItem}>
                  <div className={styles.userInfo}>
                    <div className={styles.emailRow}>
                      <span className={styles.email}>{user.email}</span>
                      {isCurrentUser && <span className={styles.badge}>You</span>}
                    </div>
                    <div className={styles.roleRow}>
                      <span className={`${styles.roleBadge} ${styles[user.role]}`}>
                        {getRoleLabel(user.role)}
                      </span>
                      <span className={styles.description}>
                        {getRoleDescription(user.role)}
                      </span>
                    </div>
                    <div className={styles.meta}>
                      Created: {new Date(user.created_at).toLocaleDateString('ko-KR')}
                    </div>
                  </div>

                  <div className={styles.actions}>
                    {!isCurrentUser && (
                      <button
                        onClick={() => handleDelete(user.id, user.email)}
                        disabled={deleting === user.id || isLastMaster}
                        className={styles.deleteBtn}
                        title={isLastMaster ? '마지막 Master 사용자는 삭제할 수 없습니다' : ''}
                      >
                        {deleting === user.id ? 'Deleting...' : 'Delete'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
