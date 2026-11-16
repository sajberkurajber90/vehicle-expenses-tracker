// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  extends: ['@vehicle-expenses-tracker/ui-core'],
  modules: ['@pinia/nuxt'],
  runtimeConfig: {
    apiInternalBase: 'http://api:3000',
    public: {
      apiBase: `https://${process.env.API_PREFIX || 'api'}.${process.env.BASE_URL || 'vehicle-expenses-tracker.local'}`,
      siteUrl: `https://${process.env.BASE_URL || 'vehicle-expenses-tracker.local'}`,
    },
  },
  vite: {
    server: {
      allowedHosts: [process.env.BASE_URL || 'vehicle-expenses-tracker.local'],
      hmr: {
        protocol: 'wss',
        host: process.env.BASE_URL || 'vehicle-expenses-tracker.local',
        clientPort: 443,
        path: 'hmr',
      },
    },
  },
});
