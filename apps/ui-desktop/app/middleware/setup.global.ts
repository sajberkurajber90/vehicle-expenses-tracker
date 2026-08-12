interface AppRegisterCompleteResponse {
  isRegisterComplete: boolean;
}

export default defineNuxtRouteMiddleware(async (to, from) => {
  const config = useRuntimeConfig();
  // TODO: add error handling for fetch requests
  // only on server - for redirect purposes
  if (import.meta.server) {
    const url = config.apiInternalBase as string;
    const { data: session } = await useFetch(`${url}/auth/get-session`);

    if (session.value === null) {
      const { data: response } = await useFetch<AppRegisterCompleteResponse>(
        `${url}/auth/app-register-complete`,
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
