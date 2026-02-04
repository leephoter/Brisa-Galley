import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { TABLES, COLUMNS } from '@/lib/data';

export async function middleware(request: NextRequest) {
  // Skip middleware for login, auth callback pages, and API routes
  if (
    request.nextUrl.pathname === '/login' ||
    request.nextUrl.pathname.startsWith('/auth/callback') ||
    request.nextUrl.pathname.startsWith('/api/auth/callback')
  ) {
    return NextResponse.next();
  }

  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || 'placeholder-service-key';

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options) {
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options) {
          response.cookies.set({ name, value: '', ...options });
        },
      },
    },
  );

  // Admin client for RLS bypass
  const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Admin page access control (excluding login page)
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Redirect to login if not authenticated
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Check admin authorization using admin client (RLS bypass)
    const { data: adminUser } = await adminClient
      .from(TABLES.ADMIN_USERS)
      .select(COLUMNS.ADMIN_USERS.ROLE)
      .eq(COLUMNS.ADMIN_USERS.ID, user.id)
      .single();

    if (!adminUser) {
      await supabase.auth.signOut();
      return NextResponse.redirect(new URL('/login?error=unauthorized', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*', '/login', '/auth/callback', '/api/auth/callback'],
};
