import { createServerSupabaseClient, createServerSupabaseAdminClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// DELETE: 사용자 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const adminClient = createServerSupabaseAdminClient();

  try {
    // 현재 사용자 확인
    const { data: { user } } = await supabase.auth.getUser();
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

    // 자기 자신은 삭제할 수 없음
    if (user.id === id) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      );
    }

    // 삭제할 사용자가 마지막 master인지 확인
    const { data: targetUser } = await supabase
      .from('admin_users')
      .select('role')
      .eq('id', id)
      .single();

    if (targetUser?.role === 'master') {
      const { count } = await supabase
        .from('admin_users')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'master');

      if (count && count <= 1) {
        return NextResponse.json(
          { error: 'Cannot delete the last master user' },
          { status: 400 }
        );
      }
    }

    // Admin client를 사용하여 Supabase Auth에서 사용자 삭제 (admin_users는 CASCADE로 자동 삭제)
    const { error: deleteError } = await adminClient.auth.admin.deleteUser(id);

    if (deleteError) throw deleteError;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Failed to delete user:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
