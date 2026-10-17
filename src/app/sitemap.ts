import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/site';

const routes: { path: string; priority: number }[] = [
  { path: '/', priority: 1 },
  { path: '/use-cases', priority: 0.8 },
  { path: '/about', priority: 0.6 },
  { path: '/contribute', priority: 0.5 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return routes.map(({ path, priority }) => ({
    url: `${siteUrl}${path === '/' ? '' : path}`,
    lastModified,
    changeFrequency: 'monthly',
    priority,
  }));
}
