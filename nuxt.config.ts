import { env } from 'node:process'

// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

if (!env.TURSO_DATABASE_URL)
  throw new Error('TURSO_DATABASE_URL is not set')

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
    '@nuxt/fonts',
  ],

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

  ogImage: {
    enabled: false,
  },

  schemaOrg: {
    identity: {
      type: 'Organization',
      name: 'NuxtFaster',
    },
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
  security: {
    rateLimiter: {
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

  /**
   * Hybrid rendering / Nitro cache (see https://nuxt.com/docs/guide/concepts/rendering#route-rules).
   * ISR disabled (CDN revalidation cost). Public pages/APIs: Cache-Control; private routes: no-store.
   */
  routeRules: {
    '/**': {
      headers: { 'cache-control': 'public, max-age=7200, s-maxage=7200, stale-while-revalidate=86400' },
    },
    '/api/search': {
      headers: { 'cache-control': 'public, max-age=7200, s-maxage=7200, stale-while-revalidate=86400' },
    },
    '/api/collections': {
      headers: { 'cache-control': 'public, max-age=7200, s-maxage=7200, stale-while-revalidate=86400' },
    },
    '/api/collection/**': {
      headers: { 'cache-control': 'public, max-age=7200, s-maxage=7200, stale-while-revalidate=86400' },
    },
    '/api/category/**': {
      headers: { 'cache-control': 'public, max-age=7200, s-maxage=7200, stale-while-revalidate=86400' },
    },
    '/api/subcategory/**': {
      headers: { 'cache-control': 'public, max-age=7200, s-maxage=7200, stale-while-revalidate=86400' },
    },
    '/api/product/**': {
      headers: { 'cache-control': 'public, max-age=7200, s-maxage=7200, stale-while-revalidate=86400' },
    },
    '/api/product-count': {
      headers: { 'cache-control': 'public, max-age=7200, s-maxage=7200, stale-while-revalidate=86400' },
    },
    '/order': {
      headers: { 'cache-control': 'private, no-store' },
    },
    '/order/**': {
      headers: { 'cache-control': 'private, no-store' },
    },
    '/order-history': {
      headers: { 'cache-control': 'private, no-store' },
    },
    '/order-history/**': {
      headers: { 'cache-control': 'private, no-store' },
    },
    '/scan': {
      headers: { 'cache-control': 'private, no-store' },
    },
    '/scan/**': {
      headers: { 'cache-control': 'private, no-store' },
    },
    '/api/auth/**': {
      headers: { 'cache-control': 'private, no-store' },
    },
    '/api/me': {
      headers: { 'cache-control': 'private, no-store' },
    },
    '/api/cart/**': {
      headers: { 'cache-control': 'private, no-store' },
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
    databaseUrl: env.TURSO_DATABASE_URL,
    public: {
      siteUrl: env.VERCEL_URL,
    },
  },

  robots: {
    blockNonSeoBots: true,
    groups: [
      {
        userAgent: '*',
        disallow: ['/products', '/api', '/order', '/order-history', '/scan'],
      },
    ],
  },
})
