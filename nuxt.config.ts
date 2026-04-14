// https://nuxt.com/docs/api/configuration/nuxt-config

import { env } from 'node:process'

if (!env.DATABASE_URL)
  throw new Error('DATABASE_URL is not set')

if (!env.REDIS_URL)
  throw new Error('REDIS_URL is not set')

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    'nuxt-auth-utils',
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    '@nuxt/eslint',
    'reka-ui/nuxt',
    '@vercel/analytics',
    '@vercel/speed-insights',
    '@nuxt/image',
    'nuxt-security',
    '@nuxt/hints',
    'nuxt-booster',
  ],
  image: {
    domains: ['localhost', '127.0.0.1', 'bevgyjm5apuichhj.public.blob.vercel-storage.com'],
    format: ['webp', 'avif', 'jpeg'],
    quality: 80,
    screens: {
      search: 40,
      thumb: 48,
      product: 256,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      '2xl': 1536,
    },
  },
  css: ['~/assets/css/main.css'],
  nitro: {
    storage: {
      cache: {
        driver: 'redis',
        url: env.REDIS_URL,
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
          "'self'",
          'data:',
          'https://bevgyjm5apuichhj.public.blob.vercel-storage.com',
        ],
      },
    },
  },
  /** CDN/browser cache hints for public GET APIs. Hot DB reads use Nitro `defineCachedFunction` (see server/utils/queries.ts). */
  routeRules: {
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
      siteUrl:
        env.NUXT_PUBLIC_SITE_URL
        || (env.VERCEL_URL
          ? `https://${env.VERCEL_URL}`
          : 'http://localhost:3000'),
    },
  },
})