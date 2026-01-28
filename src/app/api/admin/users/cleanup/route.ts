import { createServerSupabaseClient, createServerSupabaseAdminClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// DELETE: 1분 이상 지난 미확인 사용자 정리
export async function DELETE() {
  const supabase = await createServerSupabaseClient();
  const adminClient = createServerSupabaseAdminClient();

  try {
    // 현재 사용자 확인
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 현재 사용자의 권한 확인
    const { data: currentUser } = await supabase
      .from('admin_users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!currentUser || currentUser.role !== 'master') {
      return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
    }

    // 모든 auth 사용자 조회
    const { data: allUsers } = await adminClient.auth.admin.listUsers();
    const now = new Date();
    const expiredUsers: string[] = [];

    if (allUsers?.users) {
      for (const authUser of allUsers.users) {
        // 확인되지 않은 사용자만 체크
        if (!authUser.confirmed_at) {
          const createdAt = new Date(authUser.created_at);
          const timeDiffMinutes = (now.getTime() - createdAt.getTime()) / (1000 * 60);

          // 1분 이상 지난 미확인 사용자 삭제
          if (timeDiffMinutes >= 1) {
            console.log(`Cleaning up expired user: ${authUser.email}`);

            // admin_users 테이블에서 삭제
            await adminClient.from('admin_users').delete().eq('id', authUser.id);

            // auth.users에서 삭제
            await adminClient.auth.admin.deleteUser(authUser.id);

            expiredUsers.push(authUser.email || authUser.id);
          }
        }
      }
    }

    return NextResponse.json({
      message: `Cleaned up ${expiredUsers.length} expired users`,
      deletedUsers: expiredUsers,
    });
  } catch (error: unknown) {
    console.error('Failed to cleanup users:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to cleanup users';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
