import { env } from 'node:process'

// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

if (!env.DATABASE_URL)
  throw new Error('DATABASE_URL is not set')

if (!env.REDIS_URL)
  throw new Error('REDIS_URL is not set')

export default defineNuxtConfig({
  future: {
    compatibilityVersion: 5,
  },

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  compatibilityDate: '2026-04-15',
  modules: [
    '@nuxtjs/seo',
    'nuxt-auth-utils',
    '@vueuse/nuxt',
    '@nuxt/eslint',
    'reka-ui/nuxt',
    '@vercel/analytics',
    '@vercel/speed-insights',
    '@nuxt/image',
    'nuxt-security',
    '@nuxt/hints',
    'nuxt-booster',
    '@nuxt/fonts',
  ],

  booster: {
    disableNuxtFontaine: true,
  },
  fonts: {
    provider: 'google',
    defaults: {
      weights: ['100 900'],
      styles: ['normal'],
      subsets: ['latin'],
      formats: ['woff2'],
      preload: true,
    },
    families: [
      { name: 'Geist', provider: 'google', global: true, preload: true },
      { name: 'Geist Mono', provider: 'google', global: true, preload: false },
    ],
  },

  app: {
    head: {
      titleTemplate: '%s',
      htmlAttrs: {
        lang: 'en',
      },
    },
  },

  site: {
    url: env.VERCEL_URL,
    name: 'NuxtFaster',
    description: 'A performant site built with Nuxt',
    defaultLocale: 'en',
  },

  image: {
    domains: ['localhost', '127.0.0.1', 'bevgyjm5apuichhj.public.blob.vercel-storage.com'],
    format: ['avif', 'webp'],
    quality: 70,
    densities: [1, 2],
    screens: {
      placeholder: 16,
      icon: 64,
      product: 128,
      productx2: 256,
    },
  },

  nitro: {
    storage: {
      cache: {
        driver: 'redis' as const,
        url: env.REDIS_URL,
      },
    },
    devStorage: {
      cache: {
        driver: 'memory',
      },
    },
  },

  security: {
    rateLimiter: {
      driver: { name: 'redis', options: { url: env.REDIS_URL } },
      tokensPerInterval: 100_000,
      interval: 15 * 60 * 1000,
      ipHeader: 'x-real-ip',
    },
    headers: {
      contentSecurityPolicy: {
        'img-src': [
          '\'self\'',
          'data:',
          'https://bevgyjm5apuichhj.public.blob.vercel-storage.com',
        ],
      },
    },
  },

  /** CDN/browser cache hints for public GET APIs. Hot DB reads use Nitro `defineCachedFunction` (see server/utils/queries.ts). */
  routeRules: {
    // '/': {
    //   isr: 3600,
    // },
    // '/products/**': {
    //   swr: 3600,
    // },
    '/api/search': {
      headers: { 'cache-control': 'public, max-age=600' },
    },
    '/api/prefetch-images/**': {
      headers: { 'cache-control': 'public, max-age=3600' },
    },
    '/api/auth/sign-in': {
      security: {
        rateLimiter: { tokensPerInterval: 5 },
      },
    },
    '/api/auth/sign-up': {
      security: {
        rateLimiter: { tokensPerInterval: 1 },
      },
    },
  },

  runtimeConfig: {
    databaseUrl: env.DATABASE_URL,
    public: {
      siteUrl: env.VERCEL_URL,
    },
  },

  robots: {
    blockNonSeoBots: true,
  },
})
