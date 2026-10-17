import type { Metadata } from 'next';
import pkg from 'requestscript/package.json';

export const LANGUAGE_VERSION: string = pkg.version;

/**
 * The canonical origin, used for absolute URLs in metadata, the sitemap and structured data.
 * Set NEXT_PUBLIC_SITE_URL in production; on Vercel the production domain is used otherwise.
 */
export const siteUrl: string = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000')
).replace(/\/$/, '');

export const siteName = 'RequestScript';

export const siteDescription =
  'RequestScript is a small, strictly typed scripting language that you send to a server to run and get JSON back. Its syntax is inspired by TypeScript and Kotlin.';

export const keywords = [
  'RequestScript',
  'scripting language',
  'programming language',
  'API',
  'JSON',
  'TypeScript',
  'Kotlin',
  'strictly typed',
  'exact decimals',
  'composable APIs',
  'business rules',
  'versioned contracts',
];

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

interface PageMetadataOptions {
  title: string;
  description: string;
  /** The route, e.g. `/use-cases`. */
  path: string;
}

/** The shared social card from `app/opengraph-image.tsx`, which a page's own `openGraph` would otherwise drop. */
const socialImage = {
  url: '/opengraph-image',
  width: 1200,
  height: 630,
  alt: 'RequestScript: send a script, get JSON back',
};

/** Metadata for a subpage, with its canonical URL and matching Open Graph and Twitter fields. */
export function pageMetadata({ title, description, path }: PageMetadataOptions): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      siteName,
      locale: 'en_US',
      url: path,
      title: `${title} | ${siteName}`,
      description,
      images: [socialImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${siteName}`,
      description,
      images: [socialImage],
    },
  };
}
