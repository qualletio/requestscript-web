import type { Metadata } from 'next';
import Link from 'next/link';
import { ButtonLink } from '@/components/ButtonLink';
import { CodeBlock } from '@/components/CodeBlock';
import { PageHero } from '@/components/PageHero';
import { links } from '@/lib/site';
import styles from '../content.module.css';

export const metadata: Metadata = {
  title: 'Use cases',
  description: 'What you can build with RequestScript: composable APIs, versioned business rules, safe integrations and more.',
};

const useCases = [
  {
    title: 'Composable APIs',
    body: 'Let clients describe exactly what they need in one round trip. A script calls the resources your server exposes, combines the results and returns only the shape the client wants, without adding a new endpoint for every screen.',
    code: `request Dashboard {
    const weather: com.example.Weather
    const inventory: shop.Inventory

    const oslo = weather.temperature(city: "Oslo")
    const mugs = inventory.stock(sku: "RS-MUG")

    return {
        temperature: oslo.value,
        mugsInStock: mugs.value,
    }
}`,
    href: links.resources,
  },
  {
    title: 'Pricing and business rules',
    body: 'Exact decimal arithmetic and bounded decimal(p, s) types make RequestScript a natural fit for prices, taxes, discounts and fees. Rules live in contracts that product teams can read, not in deploys.',
    code: `contract billing.Discount(total: decimal(8, 2), loyaltyYears: int32) {
    var rate: decimal = 0
    if (loyaltyYears >= 5) {
        rate = 0.15
    } else if (loyaltyYears >= 2) {
        rate = 0.05
    }
    return total - total * rate
}`,
    href: links.contracts,
  },
  {
    title: 'Versioned workflows',
    body: 'Contracts are immutable and keyed by path, name and version. Publish @2 alongside @1, move clients over when they are ready, and always know exactly which logic produced a result.',
    code: `contract onboarding.Welcome@2(name: string, plan: string) {
    if (plan == "team") {
        return "Welcome aboard, \${name}! Invite your team to get started."
    }
    return "Welcome aboard, \${name}!"
}`,
    href: links.versioning,
  },
  {
    title: 'Safe, controlled integrations',
    body: 'Scripts can only reach the outside world through resources the host chooses to expose, and there are no loops to run away with. Resource failures come back as values the script can handle, so partial outages degrade gracefully.',
    code: `request OrderStatus {
    const inventory: shop.Inventory

    const stock = inventory.stock(sku: "RS-SHIRT")
    if (stock.error != null) {
        return { available: false, reason: stock.error.message }
    }

    return { available: stock.value > 0 }
}`,
    href: links.resources,
  },
  {
    title: 'An embedded rules engine',
    body: 'The interpreter is a dependency-free TypeScript library. Store scripts alongside your data and evaluate them in your own Node service, edge function or browser app, with your own resources and your own invoker.',
    code: `contract alerts.ShouldNotify(reading: object, threshold: decimal) {
    if (reading.value == null) {
        return false
    }
    return reading.value > threshold && reading.muted != true
}`,
    href: links.repository,
  },
];

export default function UseCasesPage() {
  return (
    <>
      <PageHero
        path="/use-cases"
        title="What you can build with RequestScript"
        actions={<ButtonLink href={links.quickstart}>Get started</ButtonLink>}
      >
        <p>
          Let clients compose API calls, ship business rules as versioned contracts, and integrate with other systems
          on your terms. Here are some of the ways it fits.
        </p>
      </PageHero>

      <div className={styles.useCases}>
        {useCases.map((useCase, index) => (
          <section key={useCase.title} className={styles.useCase}>
            <div className={styles.useCaseText}>
              <span className={styles.index}>{String(index + 1).padStart(2, '0')}</span>
              <h2 className={styles.useCaseTitle}>{useCase.title}</h2>
              <p>{useCase.body}</p>
              <a href={useCase.href} className={styles.textLink} target="_blank" rel="noreferrer">
                Learn more <span aria-hidden="true">→</span>
              </a>
            </div>
            <CodeBlock code={useCase.code} />
          </section>
        ))}
      </div>

      <section className={styles.closing}>
        <h2 className={styles.closingTitle}>…and much more</h2>
        <p>
          Start with the <a href={links.quickstart}>Quickstart</a> to run your first request and save your first
          contract, or try the <Link href="/#playground">playground</Link> right in your browser.
        </p>
      </section>
    </>
  );
}
