'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './AdminSidebar.module.css'

interface AdminSidebarProps {
  user: {
    email: string
    role: string
  }
}

export default function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname()

  const navItems = [
    { href: '/admin', label: 'Dashboard', exact: true },
    { href: '/admin/archives', label: 'Archives', exact: false },
  ]

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <h2>Admin Panel</h2>
        <p className={styles.email}>{user.email}</p>
      </div>

      <nav className={styles.nav}>
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navItem} ${isActive ? styles.active : ''}`}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
