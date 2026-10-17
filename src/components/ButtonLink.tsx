import Link from 'next/link';
import type { ReactNode } from 'react';
import styles from './ButtonLink.module.css';

interface ButtonLinkProps {
  href: string;
  children: ReactNode;
  variant?: 'primary' | 'outline';
  external?: boolean;
}

export function ButtonLink({ href, children, variant = 'primary', external }: ButtonLinkProps) {
  const className = `${styles.button} ${styles[variant]}`;
  if (external || /^https?:/.test(href)) {
    return (
      <a href={href} className={className} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export function ButtonRow({ children }: { children: ReactNode }) {
  return <div className={styles.row}>{children}</div>;
}
