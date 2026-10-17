'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { links, navLinks } from '@/lib/site';
import { Icon } from './Icon';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';
import styles from './Header.module.css';

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand} onClick={close}>
          <Logo className={styles.logo} title="" />
          RequestScript
        </Link>

        <nav id="site-nav" className={`${styles.nav} ${open ? styles.navOpen : ''}`} aria-label="Main">
          <ul className={styles.links}>
            {navLinks.map((link) => (
              <li key={link.href}>
                {link.external ? (
                  <a href={link.href} className={styles.link} target="_blank" rel="noreferrer">
                    {link.label}
                    <span className={styles.ext} aria-hidden="true">
                      ↗
                    </span>
                  </a>
                ) : (
                  <Link
                    href={link.href}
                    className={`${styles.link} ${pathname === link.href ? styles.active : ''}`}
                    aria-current={pathname === link.href ? 'page' : undefined}
                    onClick={close}
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          <a href={links.repository} className={styles.iconLink} target="_blank" rel="noreferrer" aria-label="GitHub">
            <Icon name="github" size={18} />
          </a>
          <ThemeToggle />
          <a href={links.quickstart} className={styles.cta} target="_blank" rel="noreferrer">
            Get started
          </a>
          <button
            type="button"
            className={styles.menuButton}
            aria-expanded={open}
            aria-controls="site-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((value) => !value)}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              {open ? (
                <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
