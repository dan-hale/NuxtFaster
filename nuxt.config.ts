// https://nuxt.com/docs/api/configuration/nuxt-config

import { env } from 'node:process'

if (!env.DATABASE_URL)
  throw new Error('DATABASE_URL is not set')

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@vueuse/nuxt', '@nuxt/eslint', 'reka-ui/nuxt', '@vercel/analytics', '@vercel/speed-insights'],
  css: ['~/assets/css/main.css'],
  /** CDN/browser cache hints for public GET APIs. DB reads also use in-process `withCache` (see server/utils/cache.ts). */
  routeRules: {
    '/api/search': {
      headers: { 'cache-control': 'public, max-age=600' },
    },
    '/api/prefetch-images/**': {
      headers: { 'cache-control': 'public, max-age=3600' },
    },
  },
  runtimeConfig: {
    databaseUrl: env.DATABASE_URL,
    authSecret:
      env.AUTH_SECRET
      || (env.NODE_ENV === 'production'
        ? ''
        : 'development-only-auth-secret-32charsXX'),
    kvRestApiUrl: env.KV_REST_API_URL,
    kvRestApiToken: env.KV_REST_API_TOKEN,
    public: {
      siteUrl:
        env.NUXT_PUBLIC_SITE_URL
        || (env.VERCEL_URL
          ? `https://${env.VERCEL_URL}`
          : 'http://localhost:3000'),
    },
  },
})
