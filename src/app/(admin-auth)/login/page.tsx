'use client'

import { useState, Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import styles from './login.module.css'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const errorParam = searchParams.get('error')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/admin')
    router.refresh()
  }

  return (
    <form onSubmit={handleLogin} className={styles.form}>
      <h1>Admin Login</h1>
      <p className={styles.subtitle}>Fashion Gallery Admin Panel</p>

      {errorParam === 'unauthorized' && (
        <div className={styles.error}>Unauthorized access. Admin privileges required.</div>
      )}

      {error && (
        <div className={styles.error}>{error}</div>
      )}

      <div className={styles.formGroup}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@example.com"
          autoComplete="email"
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          autoComplete="current-password"
          required
        />
      </div>

      <button type="submit" disabled={loading} className={styles.submitBtn}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  )
}

export default function AdminLoginPage() {
  return (
    <div className={styles.container}>
      <Suspense fallback={
        <div className={styles.form}>
          <h1>Admin Login</h1>
          <p className={styles.subtitle}>Loading...</p>
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  )
}
