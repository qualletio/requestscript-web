import type { CodeLanguage } from '@/lib/highlight';
import { CopyButton } from './CopyButton';
import { Highlighted } from './Highlighted';
import styles from './Code.module.css';

interface CodeBlockProps {
  code: string;
  language?: CodeLanguage;
  /** A caption shown in the bar above the code, such as a file name or an HTTP request line. */
  title?: string;
  /** A small label at the end of the bar, such as a status code. */
  badge?: string;
  className?: string;
}

const languageLabels: Record<CodeLanguage, string> = {
  requestscript: 'RequestScript',
  json: 'JSON',
  typescript: 'TypeScript',
  shell: 'Shell',
};

export function CodeBlock({ code, language = 'requestscript', title, badge, className }: CodeBlockProps) {
  const source = code.trim();
  return (
    <figure className={[styles.block, className].filter(Boolean).join(' ')}>
      <figcaption className={styles.bar}>
        <span className={styles.title}>{title ?? languageLabels[language]}</span>
        {badge && <span className={styles.badge}>{badge}</span>}
        <CopyButton text={source} />
      </figcaption>
      <pre className={styles.pre}>
        <code className={styles.code}>
          <Highlighted code={source} language={language} />
        </code>
      </pre>
    </figure>
  );
}
