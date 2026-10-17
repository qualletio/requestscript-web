import type { Metadata } from 'next';
import { ButtonLink } from '@/components/ButtonLink';
import { PageHero } from '@/components/PageHero';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <PageHero
      path="/…"
      status="404 Not Found"
      title="This page doesn't exist"
      actions={<ButtonLink href="/">Back to the homepage</ButtonLink>}
    >
      <p>
        <code>{'{ "error": { "type": "NotFound", "message": "Page not found" } }'}</code>
      </p>
    </PageHero>
  );
}
