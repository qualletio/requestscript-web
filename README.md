# requestscript-web

The website for RequestScript, built with Next.js (App Router), TypeScript and plain CSS Modules.

The playground runs scripts in the browser with the real interpreter from the
[`requestscript`](https://www.npmjs.com/package/requestscript) package, published from
[requestscript-js](https://github.com/qualletio/requestscript-js). Documentation lives at
[requestscript.mintlify.app](https://requestscript.mintlify.app).

## Developing

```sh
pnpm install
pnpm dev        # http://localhost:3000
pnpm lint
pnpm typecheck
pnpm build
```

## Layout

- `src/app/` — routes: home (`page.tsx`), `use-cases/`, `about/`, `contribute/`, plus `not-found.tsx`
- `src/components/` — header, footer, hero, sections, code blocks and the playground
- `src/lib/site.ts` — external links and navigation
- `src/lib/playground.ts` — playground examples, demo resources and the runner
- `src/lib/highlight.ts` — the small syntax highlighter used for code samples

Colours are CSS custom properties in `src/app/globals.css`, with a dark theme applied
from the system preference or the header toggle.
