/**
 * A small syntax highlighter for RequestScript and JSON snippets.
 *
 * It is deliberately forgiving: it never throws, and unknown characters are
 * emitted as plain text, so it can highlight half-typed code in the playground.
 */

export type TokenKind = 'keyword' | 'type' | 'string' | 'number' | 'comment' | 'punct' | 'property' | 'plain';

export interface HighlightToken {
  kind: TokenKind;
  text: string;
}

const KEYWORDS = new Set(['request', 'contract', 'var', 'const', 'return', 'if', 'else', 'true', 'false', 'null']);
const TYPES = new Set(['int32', 'int64', 'decimal', 'boolean', 'string', 'object']);
const PUNCTUATION = /[{}()[\]:,.@=!<>&|+\-*/]/;

function push(tokens: HighlightToken[], kind: TokenKind, text: string) {
  if (!text) return;
  const last = tokens[tokens.length - 1];
  if (last && last.kind === kind) last.text += text;
  else tokens.push({ kind, text });
}

/** Scans a string literal starting at `start` (the opening quote), highlighting `${...}` parts as code. */
function scanString(source: string, start: number, tokens: HighlightToken[]): number {
  let i = start + 1;
  let chunk = '"';
  while (i < source.length && source[i] !== '\n') {
    const ch = source[i];
    if (ch === '\\' && i + 1 < source.length) {
      chunk += ch + source[i + 1];
      i += 2;
      continue;
    }
    if (ch === '"') {
      chunk += ch;
      i++;
      break;
    }
    if (ch === '$' && source[i + 1] === '{') {
      push(tokens, 'string', chunk);
      chunk = '';
      push(tokens, 'punct', '${');
      i += 2;
      let depth = 1;
      const exprStart = i;
      while (i < source.length && source[i] !== '\n') {
        if (source[i] === '"') {
          // Skip over nested strings so their braces don't count.
          i++;
          while (i < source.length && source[i] !== '"' && source[i] !== '\n') i += source[i] === '\\' ? 2 : 1;
          i++;
          continue;
        }
        if (source[i] === '{') depth++;
        if (source[i] === '}' && --depth === 0) break;
        i++;
      }
      for (const token of tokenize(source.slice(exprStart, i))) push(tokens, token.kind, token.text);
      if (source[i] === '}') {
        push(tokens, 'punct', '}');
        i++;
      }
      continue;
    }
    chunk += ch;
    i++;
  }
  push(tokens, 'string', chunk);
  return i;
}

function tokenize(source: string): HighlightToken[] {
  const tokens: HighlightToken[] = [];
  let i = 0;
  while (i < source.length) {
    const ch = source[i];
    const rest = source.slice(i);

    if (rest.startsWith('//')) {
      const end = source.indexOf('\n', i);
      const stop = end === -1 ? source.length : end;
      push(tokens, 'comment', source.slice(i, stop));
      i = stop;
      continue;
    }
    if (ch === '"') {
      i = scanString(source, i, tokens);
      continue;
    }
    const number = /^\d+(\.\d+)?/.exec(rest);
    if (number) {
      push(tokens, 'number', number[0]);
      i += number[0].length;
      continue;
    }
    const word = /^[A-Za-z_][A-Za-z0-9_]*/.exec(rest);
    if (word) {
      const text = word[0];
      const after = source.slice(i + text.length);
      let kind: TokenKind = 'plain';
      if (KEYWORDS.has(text)) kind = 'keyword';
      else if (TYPES.has(text)) kind = 'type';
      else if (/^\s*:(?!:)/.test(after) && /[{,(]\s*$/.test(source.slice(0, i))) kind = 'property';
      push(tokens, kind, text);
      i += text.length;
      continue;
    }
    if (PUNCTUATION.test(ch)) {
      push(tokens, 'punct', ch);
      i++;
      continue;
    }
    push(tokens, 'plain', ch);
    i++;
  }
  return tokens;
}

/** Highlights RequestScript source. */
export function highlightRequestScript(source: string): HighlightToken[] {
  return tokenize(source);
}

/** Highlights JSON (and shell-ish or TypeScript snippets well enough for the site's samples). */
export function highlightJson(source: string): HighlightToken[] {
  const tokens: HighlightToken[] = [];
  const pattern = /("(?:[^"\\\n]|\\.)*")(\s*:)?|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)|\b(true|false|null)\b|([{}[\],:])|(\s+)|(.)/g;
  for (const match of source.matchAll(pattern)) {
    const [, str, colon, num, literal, punct, space, other] = match;
    if (str !== undefined) {
      push(tokens, colon ? 'property' : 'string', str);
      if (colon) push(tokens, 'punct', colon);
    } else if (num !== undefined) push(tokens, 'number', num);
    else if (literal !== undefined) push(tokens, 'keyword', literal);
    else if (punct !== undefined) push(tokens, 'punct', punct);
    else push(tokens, 'plain', space ?? other ?? '');
  }
  return tokens;
}

const TS_KEYWORDS = new Set([
  'import',
  'from',
  'export',
  'const',
  'let',
  'await',
  'async',
  'return',
  'new',
  'type',
  'interface',
  'function',
  'if',
  'true',
  'false',
  'null',
]);

/** Highlights TypeScript and shell snippets for the site's static samples. */
export function highlightTypeScript(source: string, shell = false): HighlightToken[] {
  const tokens: HighlightToken[] = [];
  // Shell comments start with `#` after whitespace, so URLs like https:// aren't mistaken for comments.
  const comment = shell ? /(?<=^|\s)#[^\n]*/ : /\/\/[^\n]*/;
  const rest = /('(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*"|`(?:[^`\\]|\\.)*`)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$][\w$]*)|([{}()[\]:;,.=<>!&|+\-*/?])|(\s+)|(.)/;
  const pattern = new RegExp(`(${comment.source})|${rest.source}`, 'gm');
  for (const match of source.matchAll(pattern)) {
    const [text, comment, str, num, word, punct] = match;
    if (comment !== undefined) push(tokens, 'comment', comment);
    else if (str !== undefined) push(tokens, 'string', str);
    else if (num !== undefined) push(tokens, 'number', num);
    else if (word !== undefined) push(tokens, TS_KEYWORDS.has(word) ? 'keyword' : /^[A-Z]/.test(word) ? 'type' : 'plain', word);
    else if (punct !== undefined) push(tokens, 'punct', punct);
    else push(tokens, 'plain', text);
  }
  return tokens;
}

export type CodeLanguage = 'requestscript' | 'json' | 'typescript' | 'shell';

export function highlight(source: string, language: CodeLanguage): HighlightToken[] {
  switch (language) {
    case 'requestscript':
      return highlightRequestScript(source);
    case 'json':
      return highlightJson(source);
    case 'typescript':
      return highlightTypeScript(source);
    case 'shell':
      return highlightTypeScript(source, true);
  }
}
