'use client';

import { Button, Card, DataTable } from '@/design-system/components';
import type { Column } from '@/design-system/components';
import { AppShell } from '@/components/AppShell';
import styles from './page.module.css';

const navItems = [
  { id: 'home', label: 'Home', href: '/', icon: <span>H</span> },
  { id: 'design', label: 'Design System', href: '/play/design-system', icon: <span>D</span> },
  { id: 'settings', label: 'Settings', href: '#', icon: <span>S</span> },
];

interface SampleRow {
  name: string;
  role: string;
  status: string;
  [key: string]: unknown;
}

const sampleColumns: Column<SampleRow>[] = [
  { key: 'name', header: 'Name' },
  { key: 'role', header: 'Role' },
  { key: 'status', header: 'Status', align: 'center' },
];

const sampleData: SampleRow[] = [
  { name: 'Alice Johnson', role: 'Engineer', status: 'Active' },
  { name: 'Bob Smith', role: 'Designer', status: 'Active' },
  { name: 'Carol White', role: 'Product Manager', status: 'Away' },
  { name: 'Dan Brown', role: 'Engineer', status: 'Active' },
];

export default function Home() {
  return (
    <AppShell navItems={navItems} activeNavId="home">
      <main className={styles.main}>
        <section className={styles.section}>
          <h2>Design System Test</h2>
          <p className={styles.description}>
            This is your foundation. Code is the source of truth. Figma is optional.
          </p>
        </section>

        <section className={styles.section}>
          <h3>Button Variants</h3>
          <div className={styles.buttonGroup}>
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
          </div>
        </section>

        <section className={styles.section}>
          <h3>Button Sizes</h3>
          <div className={styles.buttonGroup}>
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
        </section>

        <section className={styles.section}>
          <h3>Cards</h3>
          <div className={styles.cardGrid}>
            <Card padding="sm">
              <h4>Small Padding</h4>
              <p>This card uses small padding tokens.</p>
            </Card>
            <Card padding="md">
              <h4>Medium Padding</h4>
              <p>This card uses medium padding tokens.</p>
            </Card>
            <Card padding="lg">
              <h4>Large Padding</h4>
              <p>This card uses large padding tokens.</p>
            </Card>
          </div>
        </section>

        <section className={styles.section}>
          <h3>Data Table</h3>
          <DataTable columns={sampleColumns} data={sampleData} striped />
        </section>

        <section className={styles.section}>
          <h3>Theme Colors</h3>
          <Card>
            <div className={styles.colorGrid}>
              <div className={styles.colorSwatch} style={{ backgroundColor: 'var(--color-background-primary)' }}>
                <span>Background Primary</span>
              </div>
              <div className={styles.colorSwatch} style={{ backgroundColor: 'var(--color-background-secondary)' }}>
                <span>Background Secondary</span>
              </div>
              <div className={styles.colorSwatch} style={{ backgroundColor: 'var(--color-accent-primary)' }}>
                <span>Accent Primary</span>
              </div>
              <div className={styles.colorSwatch} style={{ backgroundColor: 'var(--color-text-primary)' }}>
                <span style={{ color: 'var(--color-background-primary)' }}>Text Primary</span>
              </div>
            </div>
          </Card>
        </section>
      </main>
    </AppShell>
  );
}
