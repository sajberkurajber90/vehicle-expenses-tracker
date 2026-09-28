import { useAPI } from '~/composables/useAPI';
import resolveAppState, { policies } from '~/utils/resolve.app.state';
import { registerAppSchemaCompleted } from '~/features/auth';

export default defineNuxtRouteMiddleware(async (to, from) => {
  const fetch = useAPI();
  if (import.meta.server) {
    // TODO: add session parse logic here
    const { data: session, error: sessionError } = await useFetch(
      `/auth/get-session`,
      {
        $fetch: fetch,
        credentials: 'include',
      },
    );

    console.log(session.value, 'session value');

    if (session.value === null) {
      const { data: response, error: appRegisterError } =
        await useFetch<unknown>(`/auth/app-register-complete`, {
          $fetch: fetch,
        });

      const parsed = registerAppSchemaCompleted.safeParse(response.value);
      if (!parsed.success) {
        return navigateTo('/login');
      }

      const appState = resolveAppState(
        session.value,
        parsed.success ? parsed.data.isRegisterComplete : false,
      );

      if (!policies[appState].allow(to.path)) {
        return navigateTo(policies[appState].redirectTo);
      }

      return;
    }

    const appState = resolveAppState(session.value, true);

    if (!policies[appState].allow(to.path)) {
      return navigateTo(policies[appState].redirectTo);
    }
  }
});
