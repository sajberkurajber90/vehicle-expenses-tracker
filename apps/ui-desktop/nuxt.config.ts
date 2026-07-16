// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  vite: {
    server: {
      allowedHosts: ['vehicle-expenses-tracker.local'],
      hmr: {
        protocol: 'wss',
        host: 'vehicle-expenses-tracker.local',
        clientPort: 443,
        path: 'hmr',
      },
    },
  },
});
