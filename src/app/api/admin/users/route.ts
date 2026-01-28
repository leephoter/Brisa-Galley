import { createServerSupabaseClient, createServerSupabaseAdminClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// GET: 모든 사용자 조회
export async function GET() {
  const supabase = await createServerSupabaseClient();

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

    // 모든 사용자 조회
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error: unknown) {
    console.error('Failed to fetch users:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch users';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// POST: 새 사용자 초대
export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { email, role } = body;

    // 유효성 검사
    if (!email || !role) {
      return NextResponse.json({ error: 'Email and role are required' }, { status: 400 });
    }

    if (role !== 'master' && role !== 'manager') {
      return NextResponse.json(
        { error: 'Invalid role. Must be "master" or "manager"' },
        { status: 400 },
      );
    }

    // inviteUserByEmail()만 자동으로 이메일을 보내고 사용자가 비밀번호를 설정할 수 있게 함
    const { data: newAuthUser, error: authError } = await adminClient.auth.admin.inviteUserByEmail(
      email,
      {
        data: {
          role, // metadata에 role 저장
        },
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/callback`,
      },
    );

    if (authError) throw authError;
    if (!newAuthUser.user) throw new Error('Failed to invite user');

    // admin_users 테이블에 추가 (일반 supabase client 사용)
    const { data: newAdminUser, error: adminError } = await adminClient
      .from('admin_users')
      .insert({
        id: newAuthUser.user.id,
        email: newAuthUser.user.email,
        role,
      })
      .select()
      .single();

    if (adminError) {
      // admin_users 추가 실패 시 auth user도 삭제
      await adminClient.auth.admin.deleteUser(newAuthUser.user.id);
      throw adminError;
    }

    return NextResponse.json({ data: newAdminUser }, { status: 201 });
  } catch (error: unknown) {
    console.error('Failed to create user:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create user';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
