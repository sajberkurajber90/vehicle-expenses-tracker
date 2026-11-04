import { useAPI } from '~/composables/useAPI';
import resolveAppState, { policies } from '~/utils/resolve.app.state';
import { useAuthStore } from '~/features/auth/auth.store';
import {
  registerAppCompleteResponseSchema,
  authUserSessionResponseSchema,
} from '~/features/auth/auth.schema';
import { roleResponseSchema } from '~/features/authorization/authorization.schema';
import { useAuthorizationStore } from '~/features/authorization/authorization.store';

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { fetchRecord } = useAPI();
  if (import.meta.server) {
    const authStore = useAuthStore();
    const authorizationStore = useAuthorizationStore();

    const { data: session } = await fetchRecord(
      'auth/get-session',
      authUserSessionResponseSchema,
    );

    if (session.value === undefined || 'kind' in session.value) {
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to fetch session - ${session.value?.kind}`,
        fatal: true,
      });
    }

    if (session.value.data === null) {
      const { data: appRegisterComplete } = await fetchRecord(
        `/auth/app-register-complete`,
        registerAppCompleteResponseSchema,
      );

      if (
        appRegisterComplete.value === undefined ||
        'kind' in appRegisterComplete.value
      ) {
        throw createError({
          statusCode: 500,
          statusMessage: `Failed to fetch app register complete - ${appRegisterComplete.value?.kind}`,
          fatal: true,
        });
      }

      const appState = resolveAppState(
        null,
        appRegisterComplete.value.data.isRegisterComplete,
      );

      if (!policies[appState].allow(to.path)) {
        return navigateTo(policies[appState].redirectTo);
      }

      return;
    }

    authStore.setSession(session.value.data.user);

    const { data: roles } = await fetchRecord(
      `/authorization/user/${session.value.data.user.id}/roles`,
      roleResponseSchema,
    );

    if (roles.value === undefined || 'kind' in roles.value) {
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to fetch roles - ${roles.value?.kind}`,
        fatal: true,
      });
    }

    authorizationStore.setSessionRole(roles.value.data);
    const appState = resolveAppState(session.value.data.user, true);

    if (!policies[appState].allow(to.path)) {
      return navigateTo(policies[appState].redirectTo);
    }
  }
});
