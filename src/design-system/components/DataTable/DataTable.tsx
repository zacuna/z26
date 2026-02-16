import styles from './DataTable.module.css';

export type CellAlignment = 'left' | 'center' | 'right';

export interface Column<T = Record<string, unknown>> {
  key: string;
  header: string;
  align?: CellAlignment;
  width?: string;
  render?: (value: unknown, row: T) => React.ReactNode;
}

export interface DataTableProps<T = Record<string, unknown>> {
  columns: Column<T>[];
  data: T[];
  size?: 'sm' | 'md' | 'lg';
  striped?: boolean;
  className?: string;
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  size = 'md',
  striped = false,
  className = '',
}: DataTableProps<T>) {
  return (
    <div className={`${styles.wrapper} ${className}`}>
      <table className={`${styles.table} ${styles[size]} ${striped ? styles.striped : ''}`}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={styles.th}
                style={{
                  textAlign: col.align || 'left',
                  width: col.width,
                }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className={styles.tr}>
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={styles.td}
                  style={{ textAlign: col.align || 'left' }}
                >
                  {col.render
                    ? col.render(row[col.key], row)
                    : String(row[col.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
