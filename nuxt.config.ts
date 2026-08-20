/// <reference path="./types/robots-nitro.d.ts" />
import { env } from 'node:process'

// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

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
    defaults: {
      cacheMaxAgeSeconds: 60 * 60 * 24 * 3,
    },
    compatibility: {
      prerender: {
        browser: false,
      },
    },
  },

  sitemap: {
    include: ['/'],
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
    '/': {
      robots: true,
    },
    '/products/**': {
      robots: false,
    },
    '/_og/**': {
      headers: { 'cache-control': 'public, max-age=259200, s-maxage=259200, stale-while-revalidate=86400' },
    },
    '/_og/d/**': {
      headers: { 'cache-control': 'public, max-age=259200, s-maxage=259200, stale-while-revalidate=86400' },
    },
    '/_og/r/**': {
      headers: { 'cache-control': 'public, max-age=259200, s-maxage=259200, stale-while-revalidate=86400' },
    },
    '/__og-image__/**': {
      headers: { 'cache-control': 'public, max-age=259200, s-maxage=259200, stale-while-revalidate=86400' },
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
      robots: false,
    },
    '/order/**': {
      headers: { 'cache-control': 'private, no-store' },
      robots: false,
    },
    '/order-history': {
      headers: { 'cache-control': 'private, no-store' },
      robots: false,
    },
    '/order-history/**': {
      headers: { 'cache-control': 'private, no-store' },
      robots: false,
    },
    '/scan': {
      headers: { 'cache-control': 'private, no-store' },
      robots: false,
    },
    '/scan/**': {
      headers: { 'cache-control': 'private, no-store' },
      robots: false,
    },
    '/api/auth/**': {
      headers: { 'cache-control': 'private, no-store' },
    },
    '/api/me': {
      headers: { 'cache-control': 'private, no-store' },
    },
    '/api/_auth/**': {
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


  robots: {
    blockNonSeoBots: true,
    blockAiBots: true,
    groups: [
      {
        userAgent: '*',
        allow: ['/_og', '/__og-image__'],
        disallow: ['/products', '/api', '/order', '/order-history', '/scan'],
      },
      {
        userAgent: ['facebookexternalhit', 'Twitterbot', 'Slackbot', 'LinkedInBot'],
        allow: ['/products', '/_og', '/__og-image__'],
        disallow: ['/api', '/order', '/order-history', '/scan'],
      },
    ],
  },
})
