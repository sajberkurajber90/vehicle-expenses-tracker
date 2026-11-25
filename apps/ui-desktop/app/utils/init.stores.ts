// fetching necessary data for the app to run properly
import { useAuthStore } from '~/features/auth/auth.store';
import { useAuthorizationStore } from '~/features/authorization/authorization.store';
import { useUserStore } from '~/features/user/user.store';
import { useAppState } from '~/composables/useAppState';
import { useTheme } from '../../../../packages/ui-core/app/composables/useTheme';

export async function initStores(userId: number): Promise<ApiError | null> {
  const { thema, setTheme } = useTheme();
  const { logout } = useAuthStore();
  const { getSessionRole } = useAuthorizationStore();
  const { getUserSettings } = useUserStore();
  const { userSettings } = storeToRefs(useUserStore());
  const { setAppState } = useAppState();

  const [role, userSettingsResponse] = await Promise.all([
    getSessionRole(userId),
    getUserSettings(userId),
  ]);

  if (role) {
    setAppState('error');
    return await logout();
  }

  // load appropriate theme based on user settings
  if (
    userSettingsResponse === null &&
    userSettings.value !== null &&
    userSettings.value.theme !== thema.value
  ) {
    setTheme(userSettings.value.theme);
  }

  return null;
}
