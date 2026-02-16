'use client';

import { useState } from 'react';
import { SiteHeader, SideNav } from '@/design-system/components';
import type { NavItem } from '@/design-system/components';
import styles from './AppShell.module.css';

export interface AppShellProps {
  children: React.ReactNode;
  navItems: NavItem[];
  activeNavId?: string;
  siteName?: string;
}

export function AppShell({
  children,
  navItems,
  activeNavId,
  siteName,
}: AppShellProps) {
  const [isSideNavExpanded, setIsSideNavExpanded] = useState(true);

  return (
    <div className={styles.shell}>
      <SiteHeader
        siteName={siteName}
        showMenuButton
        onMenuToggle={() => setIsSideNavExpanded((prev) => !prev)}
      />
      <SideNav
        items={navItems}
        isExpanded={isSideNavExpanded}
        activeId={activeNavId}
      />
      <main
        className={`${styles.content} ${isSideNavExpanded ? styles.contentExpanded : styles.contentCollapsed}`}
      >
        {children}
      </main>
    </div>
  );
}
