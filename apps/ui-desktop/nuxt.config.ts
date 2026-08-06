// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      apiBase: `https://${process.env.API_PREFIX || 'api'}.${process.env.BASE_URL || 'vehicle-expenses-tracker.local'}`,
    },
  },
  vite: {
    plugins: [tailwindcss() as any],
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
  css: ['~/assets/css/index.css'],
});
