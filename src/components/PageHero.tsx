import type { ReactNode } from 'react';
import styles from './PageHero.module.css';

interface PageHeroProps {
  /** The route shown in the request line, e.g. `/use-cases`. */
  path: string;
  status?: string;
  title: ReactNode;
  children?: ReactNode;
  actions?: ReactNode;
}

/** Subpage header, introduced by the HTTP request that "fetched" the page. */
export function PageHero({ path, status = '200 OK', title, children, actions }: PageHeroProps) {
  const failed = !status.startsWith('2');
  return (
    <section className={styles.hero}>
      <div className={styles.inner}>
        <p className={styles.requestLine}>
          <span className={styles.method}>GET</span>
          <span>{path}</span>
          <span className={styles.arrow} aria-hidden="true">
            →
          </span>
          <span className={failed ? styles.fail : styles.ok}>{status}</span>
        </p>
        <h1 className={styles.title}>{title}</h1>
        {children && <div className={styles.lead}>{children}</div>}
        {actions}
      </div>
    </section>
  );
}
