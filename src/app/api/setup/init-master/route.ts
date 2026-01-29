import { createServerSupabaseAdminClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Initial Master Account Setup API
 *
 * ⚠️ SECURITY WARNING:
 * This endpoint should ONLY be used for initial setup in production.
 * After creating the first master account, disable this endpoint by:
 * 1. Setting SETUP_ENABLED=false in environment variables, OR
 * 2. Deleting this file entirely
 *
 * Usage:
 * curl -X POST https://your-domain.com/api/setup/init-master \
 *   -H "Content-Type: application/json" \
 *   -H "X-Setup-Secret: YOUR_SETUP_SECRET" \
 *   -d '{"email": "admin@example.com", "password": "secure-password"}'
 */

export async function POST(request: NextRequest) {
  try {
    // Check if setup is enabled
    const setupEnabled = process.env.SETUP_ENABLED === 'true';
    if (!setupEnabled) {
      return NextResponse.json(
        { error: 'Setup is disabled. Remove SETUP_ENABLED or delete this endpoint.' },
        { status: 403 }
      );
    }

    // Verify setup secret
    const setupSecret = process.env.SETUP_SECRET;
    const providedSecret = request.headers.get('X-Setup-Secret');

    if (!setupSecret || setupSecret !== providedSecret) {
      console.error('Invalid setup secret');
      return NextResponse.json(
        { error: 'Invalid setup secret' },
        { status: 403 }
      );
    }

    const adminClient = createServerSupabaseAdminClient();
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Check if any master user already exists
    const { data: existingMasters } = await adminClient
      .from('admin_users')
      .select('*')
      .eq('role', 'master');

    if (existingMasters && existingMasters.length > 0) {
      return NextResponse.json(
        {
          error: 'Master account already exists. Use the admin panel to invite more users.',
          existingMasters: existingMasters.map(u => u.email)
        },
        { status: 409 }
      );
    }

    // Create auth user
    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        role: 'master'
      }
    });

    if (authError) {
      console.error('Failed to create auth user:', authError);
      throw authError;
    }

    if (!authData.user) {
      throw new Error('Failed to create user');
    }

    // Add to admin_users table
    const { data: adminUser, error: adminError } = await adminClient
      .from('admin_users')
      .insert({
        id: authData.user.id,
        email: authData.user.email,
        role: 'master'
      })
      .select()
      .single();

    if (adminError) {
      console.error('Failed to insert into admin_users:', adminError);
      // Rollback: delete auth user
      await adminClient.auth.admin.deleteUser(authData.user.id);
      throw adminError;
    }

    console.log('✅ Initial master account created:', adminUser.email);

    return NextResponse.json({
      success: true,
      message: 'Master account created successfully',
      user: {
        id: adminUser.id,
        email: adminUser.email,
        role: adminUser.role
      },
      warning: '⚠️ IMPORTANT: Disable this endpoint now by setting SETUP_ENABLED=false'
    }, { status: 201 });

  } catch (error: unknown) {
    console.error('Setup failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'Setup failed';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  const setupEnabled = process.env.SETUP_ENABLED === 'true';

  return NextResponse.json({
    enabled: setupEnabled,
    message: setupEnabled
      ? 'Setup is enabled. Use POST to create master account.'
      : 'Setup is disabled.'
  });
}
