// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "@vueuse/nuxt", "@nuxt/eslint", "reka-ui/nuxt", "@vercel/analytics", "@vercel/speed-insights"],
  css: ["~/assets/css/main.css"],
  /** CDN/browser cache hints for public GET APIs. DB reads also use in-process `withCache` (see server/utils/cache.ts). */
  routeRules: {
    "/api/search": {
      headers: { "cache-control": "public, max-age=600" },
    },
    "/api/prefetch-images/**": {
      headers: { "cache-control": "public, max-age=3600" },
    },
  },
  nitro: {
    preset: process.env.VERCEL ? "vercel" : undefined,
  },
  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL || process.env.POSTGRES_URL || "",
    authSecret:
      process.env.AUTH_SECRET ||
      (process.env.NODE_ENV === "production"
        ? ""
        : "development-only-auth-secret-32charsXX"),
    kvRestApiUrl: process.env.KV_REST_API_URL || "",
    kvRestApiToken: process.env.KV_REST_API_TOKEN || "",
    public: {
      siteUrl:
        process.env.NUXT_PUBLIC_SITE_URL ||
        (process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : "http://localhost:3000"),
    },
  },
});