'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getRoleLabel } from '@/lib/permissions';
import { UserRole } from '@/types';
import styles from './AdminSidebar.module.css';

interface AdminSidebarProps {
  user: {
    email: string;
    role: UserRole;
  };
}

export default function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin', label: 'Dashboard', exact: true, requiredRole: null },
    { href: '/admin/archives', label: 'Archives', exact: false, requiredRole: null },
    { href: '/admin/pages', label: 'Pages', exact: false, requiredRole: null },
    { href: '/admin/users', label: 'Users', exact: false, requiredRole: 'master' as const },
  ].filter((item) => !item.requiredRole || user.role === item.requiredRole);

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <h2>Admin Panel</h2>
        <p className={styles.email}>{user.email}</p>
        <div className={styles.roleContainer}>
          <span className={`${styles.roleBadge} ${styles[user.role]}`}>
            {getRoleLabel(user.role)}
          </span>
          {/* 권한 설명  */}
          {/* <span className={styles.roleDescription}>
            {getRoleDescription(user.role)}
          </span> */}
        </div>
      </div>

      <nav className={styles.nav}>
        {navItems.map((item) => {
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navItem} ${isActive ? styles.active : ''}`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
