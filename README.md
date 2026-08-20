## ⚠️ THIS IS A WORK IN PROGRESS, CONTRIBUTIONS ARE WELCOME

**Repository:** [github.com/dan-hale/NuxtFaster](https://github.com/dan-hale/NuxtFaster)

---

## nuxt-faster

A performance-oriented e-commerce template built with [Nuxt](https://nuxt.com/), inspired by [NextFaster](https://github.com/ethanniser/NextFaster) (Next.js) and the work of [@ethanniser](https://x.com/ethanniser), [@RhysSullivan](https://x.com/RhysSullivan), and [@armans-code](https://x.com/ksw_arman). **This Nuxt port lives at [NuxtFaster on GitHub](https://github.com/dan-hale/NuxtFaster).**

### Design notes

**Background on the original project: [twitter thread](https://x.com/ethanniser/status/1848442738204643330)**

- Uses [Nuxt 4](https://nuxt.com/) with [Nitro](https://nitro.unjs.io/) on the server
  - Mutations and data access go through **server routes** under `server/api/` (REST-style handlers)
- **Caching and delivery**
  - `routeRules` in `nuxt.config.ts` set CDN-friendly `cache-control` headers for public catalog API routes and HTML pages (`/**`); private routes (`/order`, `/order-history`, `/scan`, `/api/auth/**`, `/api/cart/**`, `/api/me`) use `private, no-store`
  - Catalog queries live inline in `server/api/*` and are uncached; HTTP `Cache-Control` is the cache layer
  - ISR is off. Do not add `routeRules.isr` on `/products/**` or `/**`
- **SEO and prerender**
  - Homepage only is indexable (`index, follow`). Catalog, collections, order, and scan are `noindex, nofollow`
  - `robots.txt`: `*` disallows `/products`, `/api`, `/order`, `/order-history`, `/scan`; allows `/_og` and `/__og-image__`. Social crawlers (`facebookexternalhit`, `Twitterbot`, `Slackbot`, `LinkedInBot`) may fetch `/products` for OG cards. `blockNonSeoBots` + `blockAiBots`
  - Sitemap is `/` only
  - Nitro prerender: `crawlLinks: false`. Never prerender products
  - Do not run `nuxt generate` with link crawling — that would walk the 1M product tree
  - OG images: Takumi (`ShopCard.takumi.vue`), on-demand. Cache-Control on `/_og/**` (no ISR)
- [Drizzle ORM](https://orm.drizzle.team/docs/tutorials/drizzle-with-turso) on [Turso](https://turso.tech/) (libSQL / SQLite) via `@libsql/client`. Set `TURSO_DATABASE_URL` (connection URL) and `TURSO_AUTH_TOKEN` (auth token).
- [nuxt-security](https://nuxt-security.vercel.app/) rate limiting (in-memory; stricter `tokensPerInterval` on `/api/auth/sign-in` and `/api/auth/sign-up` via `routeRules`)
- UI: [Tailwind CSS](https://tailwindcss.com/), [Reka UI](https://reka-ui.com/), [VueUse](https://vueuse.org/)
- [Vercel Analytics](https://vercel.com/docs/analytics) and [Speed Insights](https://vercel.com/docs/speed-insights) (Vue integrations)

### Deployment

Turso is the durable database for both **self-host** and **Vercel**. Writes persist (account sign-up works). Set `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` in the environment. Do not ship a local `*.db` file.

```bash
bun db:push
```

applies the Drizzle schema to Turso.

### Local development

```bash
bun install
npx nuxt dev
```

Copy `.env.example` to `.env` and fill in the Turso credentials. After changing `db/schema.ts`, run `bun db:push`.

### Production build

```bash
npx nuxt build
npx nuxt preview
```

See the [Nuxt deployment docs](https://nuxt.com/docs/getting-started/deployment) for hosting options.
