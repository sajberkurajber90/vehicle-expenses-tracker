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
  registerAppResponseSchema,
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
      logoutResponseSchema,
      loginResponseSchema,
      registerAppResponseSchema,
    },
  );

  const service: IAuthService = new AuthService(repository, {
    registerPayload: registerAppInputRefineSchema,
    registerAppRequest: registerAppRequestSchema,
    loginPayload: loginInputSchema,
  });

  const sessionUser = ref<null | AuthUserResponse>(null);
  const appRegistered = ref<boolean>(false);

  function setSession(user: AuthUserResponse | null) {
    sessionUser.value = user;
  }

  function setAppRegistered(registered: boolean) {
    appRegistered.value = registered;
  }

  async function registerApp(payload: RegisterAppInput) {
    const result = await service.registerApp(payload);
    if ('data' in result) {
      appRegistered.value = true;
    }
    return 'data' in result ? null : result;
  }

  async function login(payload: LoginInput) {
    const result = await service.login(payload);

    // set active sessionUser if login was successful
    if ('data' in result) {
      sessionUser.value = result.data.user;
      return result.data.user;
    }

    return result;
  }

  async function logout() {
    const result = await service.logout();
    if ('data' in result) {
      sessionUser.value = null;
      return null;
    }
    return result;
  }

  async function cleanUpOnLogout() {
    // perform any necessary cleanup actions on logout
    sessionUser.value = null;
  }

  return {
    appRegistered,
    sessionUser,
    setSession,
    setAppRegistered,
    registerApp,
    login,
    logout,
    cleanUpOnLogout,
  };
});
