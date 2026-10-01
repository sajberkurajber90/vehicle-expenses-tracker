import type { IAuthService } from '~/features/auth/auth.service';
import { AuthService } from '~/features/auth/auth.service';
import { AuthRepository } from '~/features/auth/auth.repository';
import {
  type AuthUserResponse,
  type LoginInput,
  loginInputSchema,
  loginResponseSchema,
  logoutResponseSchema,
  type RegisterAppInput,
  registerAppInputRefineSchema,
  registerAppRequestSchema,
} from '~/features/auth/auth.schema';
import { toApiError } from '~/utils/error';

export const useAuthStore = defineStore('auth', () => {
  const config = useRuntimeConfig();
  const repository = new AuthRepository(
    $fetch.create({
      baseURL: config.public.apiBase,
      credentials: 'include',
    }),
    toApiError,
    {
      logoutResponseSchema, // Assuming you have a logout schema defined
      loginResponseSchema,
    },
  );

  const service: IAuthService = new AuthService(repository, {
    registerPayload: registerAppInputRefineSchema,
    registerAppRequest: registerAppRequestSchema,
    loginPayload: loginInputSchema,
  });

  const sessionUser = ref<null | AuthUserResponse>(null);

  function setSession(user: AuthUserResponse | null) {
    sessionUser.value = user;
  }

  async function registerApp(payload: RegisterAppInput) {
    await service.registerApp(payload);
  }

  async function login(payload: LoginInput) {
    const result = await service.login(payload);

    // set active sessionUser if login was successful
    if ('data' in result) {
      sessionUser.value = result.data.user;
      return null;
    }

    return result;
  }

  async function logout() {
    await service.logout();
  }

  return {
    sessionUser,
    setSession,
    registerApp,
    login,
    logout,
  };
});
