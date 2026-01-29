import { redirect } from 'next/navigation';
import { createServerSupabaseClient, createServerSupabaseAdminClient } from '@/lib/supabase/server';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { TABLES, COLUMNS } from '@/lib/data';
import styles from './admin.module.css';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabaseClient();
  const adminClient = createServerSupabaseAdminClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Admin client를 사용하여 RLS 우회
  const { data: adminUser } = await adminClient
    .from(TABLES.ADMIN_USERS)
    .select('*')
    .eq(COLUMNS.ADMIN_USERS.ID, user.id)
    .single();

  if (!adminUser) {
    console.error('❌ Admin user not found:', user.id);
    redirect('/login?error=unauthorized');
  }

  return (
    <div className={styles.layout}>
      <AdminSidebar user={adminUser} />
      <div className={styles.main}>
        <AdminHeader user={adminUser} />
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}
