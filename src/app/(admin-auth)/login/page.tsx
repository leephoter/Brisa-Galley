'use client';

import { useState, Suspense } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './login.module.css';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const errorParam = searchParams.get('error');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push('/admin');
    router.refresh();
  }

  // TODO: hglee - google, github OAuth login
  // async function handleOAuthLogin(provider: 'google' | 'github') {
  //   setLoading(true);
  //   setError('');

  //   const { error } = await supabase.auth.signInWithOAuth({
  //     provider,
  //     options: {
  //       redirectTo: `${window.location.origin}/api/auth/callback`,
  //     },
  //   });

  //   if (error) {
  //     setError(error.message);
  //     setLoading(false);
  //   }
  // }

  return (
    <form onSubmit={handleLogin} className={styles.form}>
      <h1>Admin Login</h1>
      <p className={styles.subtitle}>Fashion Gallery Admin Panel</p>

      {errorParam === 'unauthorized' && (
        <div className={styles.error}>Unauthorized access. Admin privileges required.</div>
      )}

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.formGroup}>
        <label htmlFor='email'>Email</label>
        <input
          id='email'
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='admin@example.com'
          autoComplete='email'
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor='password'>Password</label>
        <input
          id='password'
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder='••••••••'
          autoComplete='current-password'
          required
        />
      </div>

      <button type='submit' disabled={loading} className={styles.submitBtn}>
        {loading ? 'Logging in...' : 'Login'}
      </button>

      {/* <div className={styles.divider}>
        <span>OR</span>
      </div> */}

      {/* <div className={styles.oauthButtons}>
        <button
          type='button'
          onClick={() => handleOAuthLogin('google')}
          disabled={loading}
          className={styles.oauthBtn}
        >
          <svg width='18' height='18' viewBox='0 0 18 18' fill='none'>
            <path
              d='M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z'
              fill='#4285F4'
            />
            <path
              d='M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z'
              fill='#34A853'
            />
            <path
              d='M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z'
              fill='#FBBC05'
            />
            <path
              d='M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z'
              fill='#EA4335'
            />
          </svg>
          Continue with Google
        </button>

        <button
          type='button'
          onClick={() => handleOAuthLogin('github')}
          disabled={loading}
          className={styles.oauthBtn}
        >
          <svg width='18' height='18' viewBox='0 0 18 18' fill='currentColor'>
            <path d='M9 0C4.03 0 0 4.13 0 9.22c0 4.08 2.58 7.54 6.15 8.76.45.08.62-.2.62-.44v-1.54c-2.5.56-3.03-1.24-3.03-1.24-.41-1.07-1-1.35-1-1.35-.82-.57.06-.56.06-.56.9.07 1.38.95 1.38.95.8 1.41 2.1 1 2.62.77.08-.6.31-1 .57-1.23-2-.23-4.1-1.02-4.1-4.55 0-1 .35-1.83.92-2.47-.09-.23-.4-1.17.09-2.44 0 0 .75-.25 2.46.94.71-.2 1.48-.3 2.24-.31.76.01 1.53.11 2.24.31 1.71-1.19 2.46-.94 2.46-.94.49 1.27.18 2.21.09 2.44.57.64.92 1.47.92 2.47 0 3.54-2.1 4.32-4.1 4.55.32.28.61.84.61 1.7v2.52c0 .24.17.52.62.44C15.42 16.76 18 13.3 18 9.22 18 4.13 13.97 0 9 0z' />
          </svg>
          Continue with GitHub
        </button>
      </div> */}
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className={styles.container}>
      <Suspense
        fallback={
          <div className={styles.form}>
            <h1>Admin Login</h1>
            <p className={styles.subtitle}>Loading...</p>
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
