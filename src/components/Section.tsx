import type { ReactNode } from 'react';
import styles from './Section.module.css';

interface SectionProps {
  id?: string;
  /** A short mono label above the title. */
  eyebrow?: string;
  title?: ReactNode;
  intro?: ReactNode;
  /** Optional element shown at the end of the heading row, such as a link. */
  aside?: ReactNode;
  children?: ReactNode;
}

export function Section({ id, eyebrow, title, intro, aside, children }: SectionProps) {
  return (
    <section id={id} className={styles.section}>
      <div className={styles.inner}>
        {(title || intro) && (
          <div className={styles.header}>
            <div className={styles.heading}>
              {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
              {title && <h2 className={styles.title}>{title}</h2>}
              {intro && <div className={styles.intro}>{intro}</div>}
            </div>
            {aside && <div className={styles.aside}>{aside}</div>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
