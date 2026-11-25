import type { AppState } from '~/utils/resolve.app.state';
import { useAuthStore } from '~/features/auth/auth.store';
import { useUserStore } from '~/features/user/user.store';

export const useAppState = () => {
  const state = useState<AppState>('appstate', () => 'unregistered');
  const transitionState = useState<boolean>('layout-transition', () => false);

  const { userSettings } = storeToRefs(useUserStore());
  const { sessionUser, appRegistered } = storeToRefs(useAuthStore());

  const setAppState = (newState: AppState) => {
    state.value = newState;
  };

  function setTransition(newState: boolean) {
    transitionState.value = newState;
  }

  const appState = computed(function () {
    if (state.value === 'error') {
      return 'error';
    }

    if (sessionUser.value) {
      if (!userSettings.value) {
        return 'needs-user-settings';
      }
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
    transitionState,
    setTransition,
  };
};
