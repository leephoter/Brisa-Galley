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
  } catch (error: any) {
    console.error('Failed to fetch users:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
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
    const { email, password, role } = body;

    // 유효성 검사
    if (!email || !password || !role) {
      return NextResponse.json(
        { error: 'Email, password, and role are required' },
        { status: 400 },
      );
    }

    if (role !== 'master' && role !== 'manager') {
      return NextResponse.json(
        { error: 'Invalid role. Must be "master" or "manager"' },
        { status: 400 },
      );
    }

    // Admin client를 사용하여 사용자 생성 (service_role key 필요)
    // 개발 환경에서는 이메일 확인 건너뛰기, 프로덕션에서는 필수
    const { data: newAuthUser, error: authError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: false,
      // email_confirm: process.env.NODE_ENV === 'development', // dev: skip, prod: required
    });

    if (authError) throw authError;
    if (!newAuthUser.user) throw new Error('Failed to create user');

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
  } catch (error: any) {
    console.error('Failed to create user:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
