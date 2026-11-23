import { useAuthStore } from '~/features/auth/auth.store';
import {
  type CreateUserSettingsInput,
  createUserSettingsInputSchema,
  updateUserSettingsInputSchema,
  type UserSettingsResponse,
  userSettingsResponseSchema,
} from '~/features/user/user.schema';
import { UserRepository } from '~/features/user/user.repository';
import { UserService } from '~/features/user/user.service';
export const useUserStore = defineStore('user', () => {
  const { fetch } = useAPI();
  const service = new UserService(
    new UserRepository(fetch, toApiError, {
      userSettingsResponseSchema,
    }),
    {
      createUserSettingsPayload: createUserSettingsInputSchema,
      updateUserSettingsPayload: updateUserSettingsInputSchema,
    },
  );
  const authStore = useAuthStore();
  authStore.$subscribe(async (mutation, state) => {
    if (!state.sessionUser) {
      await cleanUpOnLogout();
    }
  });

  const userSettings = ref<UserSettingsResponse | null>(null);
  async function getUserSettings(userId: number) {
    const result = await service.findUserSettingsByUserId(userId);
    if ('data' in result) {
      userSettings.value = result.data;
      return null;
    }

    if ('kind' in result && result.kind === 'not-found') {
      return null;
    }

    return result;
  }

  async function createUserSettings(payload: CreateUserSettingsInput) {
    const response = await service.createUserSettings(payload);
    if ('data' in response) {
      userSettings.value = response.data;
      return null;
    }

    return response;
  }

  async function cleanUpOnLogout() {
    if (userSettings.value) {
      userSettings.value = null;
    }
  }

  return {
    userSettings,
    getUserSettings,
    createUserSettings,
  };
});
