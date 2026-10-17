import type { Metadata } from 'next';
import { ButtonLink, ButtonRow } from '@/components/ButtonLink';
import { CodeBlock } from '@/components/CodeBlock';
import { PageHero } from '@/components/PageHero';
import { Section } from '@/components/Section';
import { links } from '@/lib/site';
import styles from '../content.module.css';

export const metadata: Metadata = {
  title: 'Contribute',
  description: 'Ways to contribute to RequestScript: report issues, fix bugs, improve the docs and help design the language.',
};

const ways = [
  {
    title: 'Reporting issues',
    body: (
      <>
        Found a bug, a confusing error message or a gap in the spec? Open an issue on the{' '}
        <a href={links.issues} target="_blank" rel="noreferrer">
          GitHub issue tracker ↗
        </a>{' '}
        with the script that reproduces it.
      </>
    ),
  },
  {
    title: 'Fixing bugs',
    body: (
      <>
        Pick up an open issue and send a{' '}
        <a href={links.pulls} target="_blank" rel="noreferrer">
          pull request ↗
        </a>
        . The test suite runs on embedded PGlite, so no Docker is needed to run it.
      </>
    ),
  },
  {
    title: 'Improving the docs',
    body: (
      <>
        Clear documentation is how new users learn the language. Suggest fixes, examples and new guides for the{' '}
        <a href={links.docs} target="_blank" rel="noreferrer">
          documentation ↗
        </a>
        .
      </>
    ),
  },
  {
    title: 'Language design',
    body: (
      <>
        Have ideas for the language itself, or want to bring RequestScript to another host language? Join the{' '}
        <a href={links.discord} target="_blank" rel="noreferrer">
          Discord ↗
        </a>{' '}
        to discuss proposals with the team.
      </>
    ),
  },
];

const setup = `git clone https://github.com/qualletio/requestscript-js.git
cd requestscript-js
pnpm install
pnpm test                # full suite, uses embedded PGlite
docker compose up -d     # Postgres for the dev server
pnpm dev                 # serves on http://localhost:3000`;

export default function ContributePage() {
  return (
    <>
      <PageHero
        path="/contribute"
        title="Help build RequestScript"
        actions={
          <ButtonRow>
            <ButtonLink href={links.repository}>View the repository</ButtonLink>
            <ButtonLink href={links.discord} variant="outline">
              Join the Discord
            </ButtonLink>
          </ButtonRow>
        }
      >
        <p>
          RequestScript is open source and improves with help from its community. Here are some of the ways you can get
          involved.
        </p>
      </PageHero>

      <Section eyebrow="ways to help" title="Pick a starting point">
        <div className={styles.cards}>
          {ways.map((way, index) => (
            <div key={way.title} className={styles.card}>
              <span className={styles.index}>{String(index + 1).padStart(2, '0')}</span>
              <h3 className={styles.cardTitle}>{way.title}</h3>
              <p>{way.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="local setup"
        title="Set up the repository"
        intro={
          <p>
            You need Node 20 or newer and pnpm. The language lives in <code>src/lang/</code>, the HTTP server in{' '}
            <code>src/server/</code>, and every feature has a vitest suite in <code>test/</code>.
          </p>
        }
        aside={
          <ButtonLink href={`${links.repository}#developing`} variant="outline">
            Read the developer guide
          </ButtonLink>
        }
      >
        <CodeBlock language="shell" title="Terminal" code={setup} />
      </Section>
    </>
  );
}
