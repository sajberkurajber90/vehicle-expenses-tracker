import { useAPI } from '~/composables/useAPI';

interface AppRegisterCompleteResponse {
  isRegisterComplete: boolean;
}

export default defineNuxtRouteMiddleware(async (to, from) => {
  const fetch = useAPI();
  // TODO: add error handling for fetch requests
  // only on server - for redirect purposes
  if (import.meta.server) {
    const { data: session } = await useFetch(`/auth/get-session`, {
      $fetch: fetch,
    });

    if (session.value === null) {
      const { data: response } = await useFetch<AppRegisterCompleteResponse>(
        `/auth/app-register-complete`,
        {
          $fetch: fetch,
        },
      );

      if (
        to.path !== '/register-app' &&
        response.value?.isRegisterComplete === false
      ) {
        return navigateTo('/register-app');
      }

      if (to.path === '/register-app') {
        return;
      }

      if (to.path !== '/login' && response.value?.isRegisterComplete === true) {
        return navigateTo('/login');
      }

      if (to.path === '/login') {
        return;
      }
    }
  }
});
