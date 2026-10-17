'use client';

import { useCallback, useMemo, useState, type CSSProperties, type KeyboardEvent } from 'react';
import {
  describeDeclaration,
  examples,
  httpRequestLine,
  inspect,
  resourceSignatures,
  run,
  type RunOutcome,
} from '@/lib/playground';
import { Highlighted } from './Highlighted';
import styles from './Playground.module.css';

const INDENT = '    ';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  onRun: () => void;
  language: 'requestscript' | 'json';
  label: string;
  minLines?: number;
}

/** A plain textarea layered over highlighted code, so typing stays native. */
function Editor({ value, onChange, onRun, language, label, minLines = 4 }: EditorProps) {
  const lineCount = Math.max(value.split('\n').length, minLines);

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      onRun();
      return;
    }
    if (event.key === 'Tab' && !event.shiftKey) {
      event.preventDefault();
      const target = event.currentTarget;
      const { selectionStart, selectionEnd } = target;
      const next = value.slice(0, selectionStart) + INDENT + value.slice(selectionEnd);
      onChange(next);
      requestAnimationFrame(() => {
        target.selectionStart = target.selectionEnd = selectionStart + INDENT.length;
      });
    }
  };

  return (
    <div className={styles.editorFrame}>
    <div className={styles.editor} style={{ '--min-lines': minLines } as CSSProperties}>
      <div className={styles.gutter} aria-hidden="true">
        {Array.from({ length: lineCount }, (_, i) => (
          <span key={i}>{i + 1}</span>
        ))}
      </div>
      <div className={styles.surface}>
        <pre className={styles.highlight} aria-hidden="true">
          <Highlighted code={value} language={language} />
          {'\n'}
        </pre>
        <textarea
          className={styles.input}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={onKeyDown}
          aria-label={label}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          wrap="off"
        />
      </div>
    </div>
    </div>
  );
}

function statusText(status: number): string {
  return (
    { 200: 'OK', 400: 'Bad Request', 422: 'Unprocessable Content', 500: 'Internal Server Error' }[status] ?? ''
  );
}

export function Playground() {
  const [exampleId, setExampleId] = useState(examples[0].id);
  const [source, setSource] = useState(examples[0].source);
  const [parameters, setParameters] = useState(examples[0].parameters ?? '{}');
  const [outcome, setOutcome] = useState<RunOutcome | null>(null);
  const [running, setRunning] = useState(false);

  const declaration = useMemo(() => inspect(source), [source]);
  const isContract = declaration?.kind === 'contract' || /^\s*(\/\/[^\n]*\n\s*)*contract\b/.test(source);

  const selectExample = (id: string) => {
    const example = examples.find((e) => e.id === id);
    if (!example) return;
    setExampleId(id);
    setSource(example.source);
    setParameters(example.parameters ?? '{}');
    setOutcome(null);
  };

  const execute = useCallback(async () => {
    setRunning(true);
    try {
      setOutcome(await run(source, isContract ? parameters : ''));
    } finally {
      setRunning(false);
    }
  }, [source, parameters, isContract]);

  const ok = outcome?.status === 200;

  return (
    <div className={styles.playground}>
      <div className={styles.toolbar}>
        <label className={styles.selectLabel}>
          <span className={styles.visuallyHidden}>Example</span>
          <select className={styles.select} value={exampleId} onChange={(e) => selectExample(e.target.value)}>
            {examples.map((example) => (
              <option key={example.id} value={example.id}>
                {example.label}
              </option>
            ))}
          </select>
        </label>
        <button type="button" className={styles.run} onClick={execute} disabled={running}>
          {running ? 'Running…' : 'Run ▸'}
        </button>
        <span className={styles.hint}>
          <kbd>⌘</kbd>/<kbd>Ctrl</kbd> + <kbd>Enter</kbd>
        </span>
      </div>

      <div className={styles.columns}>
        <div className={styles.inputs}>
          <Editor value={source} onChange={setSource} onRun={execute} language="requestscript" label="Script" minLines={14} />
          {isContract && (
            <div className={styles.params}>
              <div className={styles.paneLabel}>
                Parameters <span className={styles.muted}>(JSON)</span>
              </div>
              <Editor
                value={parameters}
                onChange={setParameters}
                onRun={execute}
                language="json"
                label="Contract parameters as JSON"
                minLines={3}
              />
            </div>
          )}
        </div>

        <div className={styles.output} aria-live="polite">
          <div className={styles.paneLabel}>Result</div>
          <dl className={styles.facts}>
            <dt>Declaration</dt>
            <dd>
              <code>{declaration ? describeDeclaration(declaration) : '—'}</code>
            </dd>
            <dt>Request</dt>
            <dd>
              <code>{httpRequestLine(declaration)}</code>
            </dd>
            <dt>Status</dt>
            <dd>
              {outcome ? (
                <span className={ok ? styles.ok : styles.fail}>
                  {outcome.status} {statusText(outcome.status)}
                </span>
              ) : (
                <span className={styles.muted}>Not run yet</span>
              )}
              {outcome && <span className={styles.muted}> · {outcome.durationMs.toFixed(1)} ms</span>}
            </dd>
          </dl>
          <div className={styles.response}>
            <div className={styles.subLabel}>Response body</div>
            <pre className={styles.responseBody}>
              {outcome ? (
                <Highlighted code={JSON.stringify(outcome.body, null, 2)} language="json" />
              ) : (
                <span className={styles.muted}>Press Run to execute the script in your browser.</span>
              )}
            </pre>
          </div>
          <div className={styles.resources}>
            <div className={styles.subLabel}>Demo resources</div>
            <ul>
              {resourceSignatures.map((signature) => (
                <li key={signature}>
                  <code>{signature}</code>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
