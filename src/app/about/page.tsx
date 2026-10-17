import type { Metadata } from 'next';
import { ButtonLink, ButtonRow } from '@/components/ButtonLink';
import { PageHero } from '@/components/PageHero';
import { LANGUAGE_VERSION, links } from '@/lib/site';
import styles from '../content.module.css';

export const metadata: Metadata = {
  title: 'About',
  description: 'About the RequestScript programming language and its reference implementation.',
};

const facts = [
  { label: 'Latest release', value: `v${LANGUAGE_VERSION}`, href: links.npm },
  { label: 'Syntax', value: 'TypeScript and Kotlin inspired' },
  { label: 'Reference implementation', value: 'requestscript-js', href: links.repository },
  { label: 'Package', value: 'requestscript on npm', href: links.npm },
  { label: 'Runs on', value: 'Node 20+, browsers, edge runtimes' },
  { label: 'License', value: 'Apache License 2.0', href: `${links.repository}/blob/main/LICENSE.md` },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        path="/about"
        title="A language for the body of a request"
        actions={
          <ButtonRow>
            <ButtonLink href={links.quickstart}>Get started</ButtonLink>
            <ButtonLink href="/contribute" variant="outline">
              Contribute
            </ButtonLink>
          </ButtonRow>
        }
      >
        <p>
          RequestScript is a small, strictly typed scripting language designed to be sent to a server, run, and answered
          with JSON.
        </p>
      </PageHero>

      <div className={styles.about}>
        <aside className={styles.facts} aria-label="Facts">
          <dl>
            {facts.map((fact) => (
              <div key={fact.label} className={styles.fact}>
                <dt>{fact.label}</dt>
                <dd>
                  {fact.href ? (
                    <a href={fact.href} target="_blank" rel="noreferrer">
                      {fact.value}
                    </a>
                  ) : (
                    fact.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </aside>

        <article className={styles.prose}>
          <h2>Why RequestScript</h2>
          <p>
            Most APIs offer a fixed menu of endpoints. Every new screen, report or integration means another endpoint, or
            another round trip stitched together on the client. RequestScript takes a different approach: the client
            sends a short script in the body of an HTTP request, and the server runs it against the resources it chooses
            to expose.
          </p>

          <h2>Requests and contracts</h2>
          <p>
            Scripts come in two kinds. A <strong>request</strong> is run once and discarded. A <strong>contract</strong>{' '}
            is named, versioned and saved on the server, then invoked by path with JSON parameters. Contracts are
            immutable: to change one, you publish it again under a new version, so the logic behind every result is
            always known.
          </p>

          <h2>Small on purpose</h2>
          <p>
            The syntax borrows from TypeScript and Kotlin, so it feels familiar on first read, but the language is
            intentionally much smaller. There are no loops and no user-defined functions; a script runs from top to
            bottom and returns a value. Types are strict and never silently converted, integers never wrap, and decimals
            are exact. When a resource fails, the script receives the error as a value it can handle.
          </p>

          <h2>The implementation</h2>
          <p>
            The reference implementation, <a href={links.repository}>requestscript-js</a>, is written in TypeScript and
            published to npm as <a href={links.npm}>requestscript</a>. Its root export is the language (lexer, parser,
            interpreter and exact decimals) with no server dependencies. The <code>requestscript/server</code> subpath
            adds an Express HTTP server with Postgres-backed contract storage, and the package ships a{' '}
            <code>requestscript-server</code> executable.
          </p>

          <h2>The project</h2>
          <p>
            RequestScript is open source under the Apache License 2.0 and maintained with the Quallet team. Development
            happens in the open on GitHub, and contributors coordinate on <a href={links.discord}>Discord</a>.
          </p>
        </article>
      </div>
    </>
  );
}
