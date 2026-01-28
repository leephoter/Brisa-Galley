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

    if (error) {
      console.error('Failed to fetch admin_users:', error);
      throw error;
    }

    console.log('Fetched admin_users from API:', data);
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

    // 이미 같은 이메일로 초대된 사용자가 있는지 확인
    const { data: existingUsers } = await adminClient.auth.admin.listUsers();
    const existingUser = existingUsers?.users.find((u) => u.email === email);

    if (existingUser) {
      const createdAt = new Date(existingUser.created_at);
      const now = new Date();
      const timeDiffMinutes = (now.getTime() - createdAt.getTime()) / (1000 * 60);

      // 1분 이상 지났고 아직 비밀번호 설정 안 됨 (confirmed_at이 null)
      if (timeDiffMinutes >= 1 && !existingUser.confirmed_at) {
        console.log(`Deleting expired unconfirmed user: ${email}`);

        // admin_users 테이블에서 삭제
        await adminClient.from('admin_users').delete().eq('id', existingUser.id);

        // auth.users에서 삭제
        await adminClient.auth.admin.deleteUser(existingUser.id);
      } else if (!existingUser.confirmed_at) {
        // 1분 미만이고 아직 미확인
        return NextResponse.json(
          { error: `이메일이 이미 초대되었습니다. ${Math.ceil(60 - timeDiffMinutes)}초 후에 다시 시도하세요.` },
          { status: 409 },
        );
      } else {
        // 이미 확인된 사용자
        return NextResponse.json(
          { error: '이미 등록된 이메일입니다.' },
          { status: 409 },
        );
      }
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
      console.error('Failed to insert into admin_users:', adminError);
      // admin_users 추가 실패 시 auth user도 삭제
      await adminClient.auth.admin.deleteUser(newAuthUser.user.id);
      throw adminError;
    }

    console.log('Successfully created admin user:', newAdminUser);
    return NextResponse.json({ data: newAdminUser }, { status: 201 });
  } catch (error: unknown) {
    console.error('Failed to create user:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create user';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
