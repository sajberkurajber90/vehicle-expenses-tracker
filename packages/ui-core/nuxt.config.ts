// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const currentDir = dirname(fileURLToPath(import.meta.url));

export default defineNuxtConfig({
  devtools: { enabled: true },
  css: [join(currentDir, './app/assets/css/index.css')],
  modules: ['@pinia/nuxt'],
  vite: {
    plugins: [tailwindcss() as any],
  },
});
