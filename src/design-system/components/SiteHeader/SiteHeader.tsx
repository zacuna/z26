'use client';

import { useTheme } from '@/components/ThemeProvider';
import { Button } from '../Button';
import styles from './SiteHeader.module.css';

export interface SiteHeaderProps {
  siteName?: string;
  onMenuToggle?: () => void;
  showMenuButton?: boolean;
  className?: string;
}

export function SiteHeader({
  siteName = 'Z26',
  onMenuToggle,
  showMenuButton = false,
  className = '',
}: SiteHeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className={`${styles.header} ${className}`}>
      <div className={styles.left}>
        {showMenuButton && (
          <button
            className={styles.menuButton}
            onClick={onMenuToggle}
            aria-label="Toggle navigation"
          >
            <span className={styles.menuIcon} />
          </button>
        )}
        <span className={styles.siteName}>{siteName}</span>
      </div>
      <div className={styles.right}>
        <Button onClick={toggleTheme} variant="ghost" size="sm">
          {theme === 'light' ? 'Dark' : 'Light'}
        </Button>
      </div>
    </header>
  );
}
