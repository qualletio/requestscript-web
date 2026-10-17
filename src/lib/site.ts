import pkg from 'requestscript/package.json';

export const LANGUAGE_VERSION: string = pkg.version;

export const links = {
  docs: 'https://requestscript.mintlify.app',
  quickstart: 'https://requestscript.mintlify.app/quickstart',
  language: 'https://requestscript.mintlify.app/language/syntax',
  resources: 'https://requestscript.mintlify.app/resources/overview',
  contracts: 'https://requestscript.mintlify.app/contracts/overview',
  versioning: 'https://requestscript.mintlify.app/contracts/versioning',
  httpApi: 'https://requestscript.mintlify.app/reference/http-api',
  repository: 'https://github.com/qualletio/requestscript-js',
  issues: 'https://github.com/qualletio/requestscript-js/issues',
  pulls: 'https://github.com/qualletio/requestscript-js/pulls',
  npm: 'https://www.npmjs.com/package/requestscript',
  discord: 'https://discord.gg/79agn5yPc',
} as const;

export interface NavLink {
  label: string;
  href: string;
  external?: boolean;
}

export const navLinks: NavLink[] = [
  { label: 'Docs', href: links.docs, external: true },
  { label: 'Playground', href: '/#playground' },
  { label: 'Use cases', href: '/use-cases' },
  { label: 'Contribute', href: '/contribute' },
  { label: 'About', href: '/about' },
];

export const footerColumns: { title: string; links: NavLink[] }[] = [
  {
    title: 'Learn',
    links: [
      { label: 'Documentation', href: links.docs, external: true },
      { label: 'Quickstart', href: links.quickstart, external: true },
      { label: 'Language guide', href: links.language, external: true },
      { label: 'HTTP API', href: links.httpApi, external: true },
    ],
  },
  {
    title: 'Project',
    links: [
      { label: 'Playground', href: '/#playground' },
      { label: 'Use cases', href: '/use-cases' },
      { label: 'About', href: '/about' },
      { label: 'Contribute', href: '/contribute' },
    ],
  },
  {
    title: 'Community',
    links: [
      { label: 'GitHub', href: links.repository, external: true },
      { label: 'Discord', href: links.discord, external: true },
      { label: 'npm', href: links.npm, external: true },
      { label: 'Report an issue', href: links.issues, external: true },
    ],
  },
];
