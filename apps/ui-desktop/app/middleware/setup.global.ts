import { useAPI } from '~/composables/useAPI';
import resolveAppState, { policies } from '~/utils/resolve.app.state';
import { registerAppSchemaCompleted } from '~/features/auth';

export default defineNuxtRouteMiddleware(async (to, from) => {
  const fetch = useAPI();
  if (import.meta.server) {
    const { data: session } = await useFetch(`/auth/get-session`, {
      $fetch: fetch,
    });

    if (session.value === null) {
      const { data: response } = await useFetch<unknown>(
        `/auth/app-register-complete`,
        {
          $fetch: fetch,
        },
      );

      const parsed = registerAppSchemaCompleted.safeParse(response.value);

      if (!parsed.success) {
        navigateTo('/login');
      }

      const appState = resolveAppState(
        session.value,
        parsed.success ? parsed.data.isRegisterComplete : false,
      );

      if (!policies[appState].allow(to.path)) {
        return navigateTo(policies[appState].redirectTo);
      }
    }

    const appState = resolveAppState(session.value, true);

    if (!policies[appState].allow(to.path)) {
      return navigateTo(policies[appState].redirectTo);
    }
  }
});
