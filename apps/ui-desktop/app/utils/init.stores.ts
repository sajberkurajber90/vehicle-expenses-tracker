// fetching necessary data for the app to run properly
import { useAuthStore } from '~/features/auth/auth.store';
import { useAuthorizationStore } from '~/features/authorization/authorization.store';
import { useAppState } from '~/composables/useAppState';

export async function initStores(userId: number): Promise<ApiError | null> {
  const { logout } = useAuthStore();
  const { getSessionRole } = useAuthorizationStore();
  const { setAppState } = useAppState();

  const [role] = await Promise.all([getSessionRole(userId)]);

  if (role) {
    setAppState('error');
    return await logout();
  }

  return null;
}
