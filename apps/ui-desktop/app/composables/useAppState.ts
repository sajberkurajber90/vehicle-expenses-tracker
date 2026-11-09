import type { AppState } from '~/utils/resolve.app.state';
import { useAuthStore } from '~/features/auth/auth.store';

export const useAppState = () => {
  const state = useState<AppState>('appstate', () => 'unregistered');
  const authStore = useAuthStore();
  const { sessionUser, appRegistered } = storeToRefs(authStore);

  const setAppState = (newState: AppState) => {
    state.value = newState;
  };

  const appState = computed(function () {
    if (state.value === 'error') {
      return 'error';
    }

    if (sessionUser.value) {
      return 'authenticated';
    }

    if (!appRegistered.value) {
      return 'unregistered';
    }

    return 'needs-login';
  });

  return {
    appState,
    setAppState,
  };
};
