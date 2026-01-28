import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import UserManagement from '@/components/admin/UserManagement';
import styles from './users.module.css';

export default async function AdminUsersPage() {
  const supabase = await createServerSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // 현재 사용자 정보 조회
  const { data: currentUser } = await supabase
    .from('admin_users')
    .select('*')
    .eq('id', user.id)
    .single();

  // master가 아니면 접근 불가
  if (!currentUser || currentUser.role !== 'master') {
    redirect('/admin');
  }

  // 모든 사용자 조회
  const { data: users } = await supabase
    .from('admin_users')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>User Management</h1>
          <p className={styles.subtitle}>Manage admin users and permissions</p>
        </div>
      </div>

      <UserManagement users={users || []} currentUserId={user.id} />
    </div>
  );
}
