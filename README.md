## ⚠️ THE SITE IS EXPERIENCING AN OUTAGE FROM EXCEEDING FREE TIER USAGE ON NEON

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
  - `routeRules` in `nuxt.config.ts` set CDN-friendly `cache-control` headers for selected public API routes
  - Hot catalog reads use Nitro [`defineCachedFunction`](https://nitro.build/docs/cache) in `server/utils/queries.ts` backed by Redis (`REDIS_URL`, `nitro.storage.cache`)
- [Drizzle ORM](https://orm.drizzle.team/docs/overview) on top of [Neon Postgres](https://neon.tech)
- [nuxt-security](https://nuxt-security.vercel.app/) rate limiting (global Redis driver + window; stricter `tokensPerInterval` on `/api/auth/sign-in` and `/api/auth/sign-up` via `routeRules`), with [`ioredis`](https://github.com/redis/ioredis) for unstorage’s Redis driver
- UI: [Tailwind CSS](https://tailwindcss.com/), [Reka UI](https://reka-ui.com/), [VueUse](https://vueuse.org/)
- [Vercel Analytics](https://vercel.com/docs/analytics) and [Speed Insights](https://vercel.com/docs/speed-insights) (Vue integrations)

### Deployment

- Connect your deployment (e.g. Vercel) to a Neon Postgres database and Redis, and set the env vars the app expects (`DATABASE_URL` / `POSTGRES_URL`, `REDIS_URL`, etc.).
- Apply the schema: `pnpm db:push`

### Local development

- Link and pull env (if using Vercel): `vc link` then `vc env pull` to obtain a `.env` / `.env.local` with database and Redis credentials.
- Install and run:

```bash
pnpm install
pnpm dev
```

- For Drizzle against Neon in development, ensure your connection string includes `?sslmode=required` where appropriate, then run `pnpm db:push` to sync the schema.

### Production build

```bash
pnpm build
pnpm preview
```

See the [Nuxt deployment docs](https://nuxt.com/docs/getting-started/deployment) for hosting options. With `VERCEL` set in the environment, Nitro uses the `vercel` preset (see `nuxt.config.ts`).
