import { useAPI } from '~/composables/useAPI';
import resolveAppState, { policies } from '~/utils/resolve.app.state';
import {
  registerAppCompleteResponseSchema,
  authUserSessionResponseSchema,
  useAuthStore,
} from '~/features/auth';

export default defineNuxtRouteMiddleware(async (to, from) => {
  const fetch = useAPI();
  if (import.meta.server) {
    const authStore = useAuthStore();
    const { data: session, error: sessionError } = await useFetch<unknown>(
      `/auth/get-session`,
      {
        $fetch: fetch,
        credentials: 'include',
      },
    );

    console.log('session', session.value, sessionError.value);

    if (session.value === null) {
      const { data: response, error: appRegisterError } =
        await useFetch<unknown>(`/auth/app-register-complete`, {
          $fetch: fetch,
        });

      const parsed = registerAppCompleteResponseSchema.safeParse(
        response.value,
      );
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

    const parsedSession = authUserSessionResponseSchema.safeParse(
      session.value,
    );

    authStore.setSession(
      parsedSession.success ? parsedSession.data.user : null,
    );

    const appState = resolveAppState(
      parsedSession.success ? parsedSession.data.user : null,
      true,
    );

    if (!policies[appState].allow(to.path)) {
      return navigateTo(policies[appState].redirectTo);
    }
  }
});
