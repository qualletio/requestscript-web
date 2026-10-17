import Link from 'next/link';
import { footerColumns, LANGUAGE_VERSION, links } from '@/lib/site';
import { Logo } from './Logo';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <Link href="/" className={styles.wordmark}>
            <Logo className={styles.logo} title="" />
            RequestScript
          </Link>
          <p className={styles.tagline}>A small, strictly typed scripting language you send to a server to run.</p>
          <p className={styles.version}>
            <span className={styles.dot} aria-hidden="true" />
            requestscript@{LANGUAGE_VERSION}
          </p>
        </div>
        {footerColumns.map((column) => (
          <div key={column.title}>
            <h2 className={styles.heading}>{column.title}</h2>
            <ul className={styles.list}>
              {column.links.map((link) => (
                <li key={link.label}>
                  {link.external ? (
                    <a href={link.href} target="_blank" rel="noreferrer">
                      {link.label}
                    </a>
                  ) : (
                    <Link href={link.href}>{link.label}</Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className={styles.bottom}>
        <p>© {new Date().getFullYear()} RequestScript contributors</p>
        <p>
          Released under the{' '}
          <a href={`${links.repository}/blob/main/LICENSE.md`} target="_blank" rel="noreferrer">
            Apache License 2.0
          </a>
        </p>
      </div>
    </footer>
  );
}
