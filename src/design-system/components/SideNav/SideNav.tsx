'use client';

import Link from 'next/link';
import styles from './SideNav.module.css';

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon?: React.ReactNode;
}

export interface SideNavProps {
  items: NavItem[];
  isExpanded: boolean;
  activeId?: string;
  onNavigate?: (item: NavItem) => void;
  className?: string;
}

export function SideNav({
  items,
  isExpanded,
  activeId,
  onNavigate,
  className = '',
}: SideNavProps) {
  return (
    <nav
      className={`${styles.nav} ${isExpanded ? styles.expanded : styles.collapsed} ${className}`}
      aria-label="Side navigation"
    >
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.id}>
            <Link
              href={item.href}
              className={`${styles.link} ${activeId === item.id ? styles.active : ''}`}
              onClick={() => onNavigate?.(item)}
              title={!isExpanded ? item.label : undefined}
            >
              {item.icon && <span className={styles.icon}>{item.icon}</span>}
              {isExpanded && <span className={styles.label}>{item.label}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
