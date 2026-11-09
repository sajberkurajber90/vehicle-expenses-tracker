import { AuthorizationRepostory } from '~/features/authorization/authorization.repository';
import { toApiError } from '~/utils/error';
import {
  type PermissionResponse,
  type RoleResponse,
  roleResponseSchema,
} from '~/features/authorization/authorization.schema';
import { AuthorizationService } from '~/features/authorization/authorization.service';
import { useAuthStore } from '~/features/auth/auth.store';

export const useAuthorizationStore = defineStore('authorization', () => {
  const { fetch } = useAPI();
  const service = new AuthorizationService(
    new AuthorizationRepostory(fetch, toApiError, {
      roleResponseSchema: roleResponseSchema,
    }),
  );

  const authStore = useAuthStore();

  authStore.$subscribe(async (mutation, state) => {
    if (!state.sessionUser) {
      await cleanUpOnLogout();
    }
  });

  const sessionRole = ref<null | RoleResponse>(null);
  const sessionPermissions = ref<null | PermissionResponse[]>(null);

  function setSessionRole(role: RoleResponse) {
    sessionRole.value = role;
  }

  function setSessionPermissions(permissions: PermissionResponse[]) {
    if (!sessionPermissions.value) {
      sessionPermissions.value = [];
    }

    sessionPermissions.value.push(...permissions);
  }

  const sessionRoleName = computed(() => sessionRole.value?.name ?? '');

  async function getSessionRole(userId: number) {
    const result = await service.findRoleByUserId(userId);
    if ('data' in result) {
      sessionRole.value = result.data;
      return null;
    }

    return result;
  }

  async function cleanUpOnLogout() {
    if (sessionRole.value) {
      sessionRole.value = null;
    }
    if (sessionPermissions.value) {
      sessionPermissions.value = null;
    }
  }

  return {
    sessionRole,
    setSessionRole,
    sessionPermissions,
    setSessionPermissions,
    getSessionRole,
    cleanUpOnLogout,
    sessionRoleName,
  };
});
