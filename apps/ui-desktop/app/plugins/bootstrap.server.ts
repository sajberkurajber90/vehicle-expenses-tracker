import { useAPI } from '~/composables/useAPI';
import { useAuthStore } from '~/features/auth/auth.store';
import {
  authUserSessionResponseSchema,
  registerAppCompleteResponseSchema,
} from '~/features/auth/auth.schema';

import { initStores } from '~/utils/init.stores';

export default defineNuxtPlugin({
  name: 'setup-global',
  async setup(_) {
    const { fetchRecord } = useAPI();
    const authStore = useAuthStore();

    // fetch the session
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
      // check if the app registration is complete - (first user registered)
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

      if (appRegisterComplete.value.data.isRegisterComplete) {
        authStore.setAppRegistered(true);
      }
    } else {
      // initStores the app if the session is valid
      authStore.setSession(session.value.data.user);
      authStore.setAppRegistered(true);
      await initStores(session.value.data.user.id);
    }
  },
});
