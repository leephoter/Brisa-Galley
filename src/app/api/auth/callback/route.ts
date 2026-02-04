import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { TABLES, COLUMNS } from '@/lib/data';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const origin = requestUrl.origin;

  if (code) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(_name: string, _value: string, _options) {
            // Note: We can't set cookies in GET route handler response
            // They will be set by middleware
          },
          remove(_name: string, _options) {
            // Note: We can't remove cookies in GET route handler response
          },
        },
      }
    );

    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      console.error('OAuth exchange error:', exchangeError);
      return NextResponse.redirect(`${origin}/login?error=oauth_failed`);
    }

    // Get the user after successful OAuth
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      // Check if user exists in admin_users
      const { data: adminUser } = await supabase
        .from(TABLES.ADMIN_USERS)
        .select('*')
        .eq(COLUMNS.ADMIN_USERS.ID, user.id)
        .single();

      if (!adminUser) {
        // Auto-provision admin user for SSO
        // You can customize this logic based on email domain or other criteria
        const shouldAutoProvision = checkIfShouldAutoProvision(user.email || '');

        if (shouldAutoProvision) {
          const { error: insertError } = await supabase.from(TABLES.ADMIN_USERS).insert({
            [COLUMNS.ADMIN_USERS.ID]: user.id,
            [COLUMNS.ADMIN_USERS.EMAIL]: user.email,
            [COLUMNS.ADMIN_USERS.ROLE]: 'manager', // Default role for SSO users
            [COLUMNS.ADMIN_USERS.CONFIRMED_AT]: new Date().toISOString(),
          });

          if (insertError) {
            console.error('Failed to create admin user:', insertError);
            await supabase.auth.signOut();
            return NextResponse.redirect(`${origin}/login?error=unauthorized`);
          }
        } else {
          // User not authorized
          await supabase.auth.signOut();
          return NextResponse.redirect(`${origin}/login?error=unauthorized`);
        }
      }
    }

    // Redirect to admin after successful authentication
    return NextResponse.redirect(`${origin}/admin`);
  }

  // No code provided
  return NextResponse.redirect(`${origin}/login?error=no_code`);
}

/**
 * Determine if user should be auto-provisioned as admin
 * Customize this logic based on your requirements
 */
function checkIfShouldAutoProvision(email: string): boolean {
  // Example 1: Allow specific email domains
  const allowedDomains = process.env.ADMIN_ALLOWED_DOMAINS?.split(',') || [];
  if (allowedDomains.length > 0) {
    const domain = email.split('@')[1];
    return allowedDomains.includes(domain);
  }

  // Example 2: Allow specific emails
  const allowedEmails = process.env.ADMIN_ALLOWED_EMAILS?.split(',') || [];
  if (allowedEmails.length > 0) {
    return allowedEmails.includes(email);
  }

  // Example 3: Default - require manual approval (return false)
  // This is the safest option for production
  return false;
}
