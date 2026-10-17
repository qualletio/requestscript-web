import { ButtonLink, ButtonRow } from '@/components/ButtonLink';
import { CodeBlock } from '@/components/CodeBlock';
import { CopyButton } from '@/components/CopyButton';
import { Playground } from '@/components/Playground';
import { Section } from '@/components/Section';
import { LANGUAGE_VERSION, links } from '@/lib/site';
import styles from './page.module.css';

const principles = [
  {
    title: 'Strict types',
    body: (
      <>
        Every variable has a type that never changes, and values are never silently converted. <code>if (1)</code> is
        an error, not a guess.
      </>
    ),
  },
  {
    title: 'Exact numbers',
    body: (
      <>
        Integers never wrap and decimal arithmetic is exact, so <code>0.1 + 0.2 == 0.3</code> is <code>true</code>.
        Built for prices and quantities.
      </>
    ),
  },
  {
    title: 'Deliberately small',
    body: (
      <>No loops and no user-defined functions. A script runs top to bottom and returns a value, so it is easy to review.</>
    ),
  },
  {
    title: 'Recoverable failures',
    body: (
      <>
        A failing resource call hands the script an <code>error</code> it can inspect, instead of failing the whole
        request.
      </>
    ),
  },
];

const heroScript = `request Forecast {
    const weather: com.example.Weather

    const t = weather.temperature(city: "Oslo")
    if (t.error != null) {
        return t.error.message
    }

    return { city: "Oslo", celsius: t.value }
}`;

const heroResponse = `{
  "returnValue": { "city": "Oslo", "celsius": 4.5 }
}`;

const requestSample = `request Greeting {
    const name = "Ada"
    return "Hello \${name}!"
}`;

const contractSample = `contract shop.orders.LineTotal@2(item: object, taxRate: decimal(1, 4)) {
    const subtotal: decimal = item.price * item.quantity
    return { total: subtotal + subtotal * taxRate }
}`;

const librarySample = `import { createResourceResolver, interpret } from 'requestscript';

const result = await interpret(source, {
  resourceResolver: createResourceResolver([weather]),
  parameters: { city: 'Oslo' },
});

console.log(result.returnValue);`;

const serverSample = `import { createResourceResolver } from 'requestscript';
import { startServer } from 'requestscript/server';

// Connects to Postgres, runs migrations and listens.
await startServer({
  port: 3000,
  resourceResolver: createResourceResolver([weather]),
  middleware: [authMiddleware],
});`;

const install = 'pnpm add requestscript';

export default function Home() {
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <a href={links.resources} className={styles.pill} target="_blank" rel="noreferrer">
              <span className={styles.pillTag}>v{LANGUAGE_VERSION}</span>
              Resource calls now return results you can handle
              <span aria-hidden="true">→</span>
            </a>
            <h1 className={styles.heroTitle}>
              Send a script.
              <br />
              <span className={styles.heroAccent}>Get JSON back.</span>
            </h1>
            <p className={styles.heroLead}>
              RequestScript is a small, strictly typed scripting language that you send to a server to run. Instead of
              calling a fixed set of endpoints, put the logic in the request body and get exactly the result you need.
            </p>
            <ButtonRow>
              <ButtonLink href={links.quickstart}>Get started</ButtonLink>
              <ButtonLink href="#playground" variant="outline">
                Try the playground
              </ButtonLink>
            </ButtonRow>
            <div className={styles.install}>
              <span className={styles.prompt} aria-hidden="true">
                $
              </span>
              <code>{install}</code>
              <CopyButton text={install} />
            </div>
          </div>

          <div className={styles.exchange}>
            <CodeBlock title="POST /run" code={heroScript} />
            <div className={styles.connector} aria-hidden="true">
              <span />
              server runs the script
              <span />
            </div>
            <CodeBlock title="Response" badge="200 OK" language="json" code={heroResponse} />
          </div>
        </div>
      </section>

      <section className={styles.principles} aria-label="Design principles">
        <ol className={styles.principleList}>
          {principles.map((principle, index) => (
            <li key={principle.title} className={styles.principle}>
              <span className={styles.principleIndex}>{String(index + 1).padStart(2, '0')}</span>
              <h2 className={styles.principleTitle}>{principle.title}</h2>
              <p>{principle.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <Section
        eyebrow="two kinds of scripts"
        title="One-off requests. Versioned contracts."
        intro={
          <p>
            Every script is either a <strong>request</strong>, run once and discarded, or a <strong>contract</strong>:
            named, versioned, saved on the server and invoked later with JSON parameters.
          </p>
        }
        aside={
          <ButtonLink href={links.contracts} variant="outline">
            How contracts work
          </ButtonLink>
        }
      >
        <div className={styles.kinds}>
          <article className={styles.kind}>
            <header className={styles.kindHeader}>
              <span className={styles.kindTag}>request</span>
              <h3>Run it once</h3>
              <p>Post the script to the server, get the result back. Requests take no parameters.</p>
            </header>
            <CodeBlock title="POST /run" code={requestSample} />
            <CodeBlock title="Response" badge="200 OK" language="json" code={`{ "returnValue": "Hello Ada!" }`} />
          </article>
          <article className={styles.kind}>
            <header className={styles.kindHeader}>
              <span className={styles.kindTag}>contract</span>
              <h3>Save it, version it, call it</h3>
              <p>
                Contracts are immutable per version. Publish <code>@2</code> next to <code>@1</code> and move clients
                over when they are ready.
              </p>
            </header>
            <CodeBlock title="POST /contracts" code={contractSample} />
            <CodeBlock
              title="POST /run/shop/orders/LineTotal@2"
              language="json"
              code={`{ "parameters": { "item": { "price": 9.99, "quantity": 2 }, "taxRate": 0.0825 } }`}
            />
          </article>
        </div>
      </Section>

      <Section
        eyebrow="embed it"
        title="Runs wherever TypeScript runs"
        intro={
          <p>
            The reference implementation is the <code>requestscript</code> package. Its root export is the language
            itself (lexer, parser, exact decimals and interpreter) with no server or database, so it runs in Node, at
            the edge and in the browser. The playground below runs on it.
          </p>
        }
        aside={
          <ButtonRow>
            <ButtonLink href={links.httpApi} variant="outline">
              HTTP API reference
            </ButtonLink>
          </ButtonRow>
        }
      >
        <div className={styles.kinds}>
          <CodeBlock title="app.ts · in your own code" language="typescript" code={librarySample} />
          <CodeBlock title="server.ts · or serve the HTTP API" language="typescript" code={serverSample} />
        </div>
      </Section>

      <Section
        id="playground"
        eyebrow="playground"
        title="Try it in your browser"
        intro={
          <p>
            Scripts run locally on the real interpreter, and the result is shaped exactly like the server&apos;s HTTP
            response. Pick an example or write your own.
          </p>
        }
        aside={
          <ButtonLink href={links.language} variant="outline">
            Language guide
          </ButtonLink>
        }
      >
        <Playground />
      </Section>

      <section className={styles.ctaWrap}>
        <div className={styles.cta}>
          <div>
            <h2 className={styles.ctaTitle}>Help shape RequestScript</h2>
            <p className={styles.ctaText}>
              The language is open source and young, which makes now the best time to influence it. Report issues, fix
              bugs, improve the docs, or bring it to a new host language.
            </p>
          </div>
          <ButtonRow>
            <ButtonLink href="/contribute">Start contributing</ButtonLink>
            <ButtonLink href={links.discord} variant="outline">
              Join the Discord
            </ButtonLink>
          </ButtonRow>
        </div>
      </section>
    </>
  );
}
