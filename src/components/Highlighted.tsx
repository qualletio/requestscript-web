import { highlight, type CodeLanguage } from '@/lib/highlight';
import styles from './Code.module.css';

interface HighlightedProps {
  code: string;
  language: CodeLanguage;
}

/** Renders highlighted tokens as spans; the caller supplies the surrounding <pre>/<code>. */
export function Highlighted({ code, language }: HighlightedProps) {
  return (
    <>
      {highlight(code, language).map((token, index) =>
        token.kind === 'plain' ? token.text : (
          <span key={index} className={styles[token.kind]}>
            {token.text}
          </span>
        ),
      )}
    </>
  );
}
