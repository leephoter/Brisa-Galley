'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import styles from './callback.module.css';

export const dynamic = 'force-dynamic';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const supabase = createClient();

  const handleInviteSession = useCallback(async (accessToken: string, refreshToken: string) => {
    try {
      // 세션 설정 (비밀번호 설정을 위해 필요)
      const { error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      if (error) throw error;

      // 세션 설정 성공 - 비밀번호 설정 페이지 표시
      setIsPasswordReset(true);
      setLoading(false);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : '세션 설정에 실패했습니다';
      setError('세션 설정에 실패했습니다: ' + errorMessage);
      setLoading(false);
    }
  }, [supabase])

  const handleEmailConfirmation = useCallback(async (accessToken: string) => {
    try {
      const { error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: '',
      });

      if (error) throw error;

      router.push('/admin');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to confirm email';
      setError(errorMessage);
      setLoading(false);
    }
  }, [supabase, router]);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('비밀번호는 최소 8자 이상이어야 합니다.');
      return;
    }

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    setLoading(true);

    try {
      // 비밀번호 업데이트
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) throw updateError;

      // 비밀번호 설정 성공 - 로그인 페이지로 이동
      alert('비밀번호가 설정되었습니다. 이제 로그인할 수 있습니다.');

      // 세션 종료
      await supabase.auth.signOut();

      router.push('/login');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to set password';
      setError(errorMessage);
      setLoading(false);
    }
  };

  useEffect(() => {
    // URL 해시에서 토큰 정보 가져오기
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    const refreshToken = hashParams.get('refresh_token');
    const type = hashParams.get('type');

    if (accessToken && type === 'invite') {
      // 초대 토큰인 경우 먼저 세션 설정
      handleInviteSession(accessToken, refreshToken || '');
    } else if (accessToken) {
      // 다른 타입의 토큰 (예: 이메일 확인)
      handleEmailConfirmation(accessToken);
    } else {
      setError('유효하지 않은 링크입니다.');
      setLoading(false);
    }
  }, [handleInviteSession, handleEmailConfirmation]);

  if (loading && !isPasswordReset) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <p>처리 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <h1>오류</h1>
          <p className={styles.error}>{error}</p>
          <a href="/login" className={styles.link}>
            로그인 페이지로 이동
          </a>
        </div>
      </div>
    );
  }

  if (isPasswordReset) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <h1>비밀번호 설정</h1>
          <p className={styles.description}>새로운 비밀번호를 설정하세요.</p>

          <form onSubmit={handlePasswordSubmit} className={styles.form}>
            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.formGroup}>
              <label htmlFor="password">비밀번호</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="최소 8자 이상"
                required
                minLength={8}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword">비밀번호 확인</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="비밀번호 재입력"
                required
              />
            </div>

            <button type="submit" disabled={loading} className={styles.submitBtn}>
              {loading ? '설정 중...' : '비밀번호 설정'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return null;
}
