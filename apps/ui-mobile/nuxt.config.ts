// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  vite: {
    server: {
      allowedHosts: ['m.vehicle-expenses-tracker.local'],
      hmr: {
        protocol: 'wss',
        host: 'm.vehicle-expenses-tracker.local',
        clientPort: 443,
        path: 'm/hmr',
      },
    },
  },
});
