'use client';

import { useState } from 'react';
import styles from './Code.module.css';

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard access can be denied; there is nothing useful to do.
    }
  };

  return (
    <button type="button" className={styles.copy} onClick={copy} aria-label="Copy code">
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}
