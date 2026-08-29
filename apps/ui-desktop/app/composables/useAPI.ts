export function useAPI() {
  const config = useRuntimeConfig();

  return $fetch.create({
    baseURL: import.meta.server
      ? config.apiInternalBase
      : config.public.apiBase,
    credentials: 'include',
    onRequest: ({ options }) => {
      if (import.meta.server) {
        const headers = useRequestHeaders(['cookie']);
        if (headers && headers['cookie']) {
          options.headers.set('cookie', headers['cookie']);
        }
      }
    },
    async onResponse({ response }) {
      // only on client side - for redirect purposes
      if (import.meta.client && response.status === 401) {
        await navigateTo('/login');
      }
    },
  });
}
