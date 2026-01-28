'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import styles from './AdminHeader.module.css'

interface AdminHeaderProps {
  user: {
    email: string
  }
}

export default function AdminHeader(_props: AdminHeaderProps) {
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <header className={styles.header}>
      <h1>Fashion Gallery Admin</h1>
      <button onClick={handleLogout} className={styles.logoutBtn}>
        Logout
      </button>
    </header>
  )
}
