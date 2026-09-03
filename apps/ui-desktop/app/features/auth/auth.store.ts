import type { IAuthService } from '~/features/auth/auth.service';
import { AuthService } from '~/features/auth/auth.service';
import { AuthRepository } from '~/features/auth/auth.repository';
import {
  type LoginInput,
  loginSchema,
  type RegisterAppFormInput,
  registerAppSchemaRefined,
} from '~/features/auth/auth.schema';

export const useAuthStore = defineStore('auth', () => {
  const config = useRuntimeConfig();
  const repository = new AuthRepository(
    $fetch.create({
      baseURL: config.public.apiBase,
    }),
  );

  const service: IAuthService = new AuthService(repository, {
    registerPayload: registerAppSchemaRefined,
    loginPayload: loginSchema,
  });

  const session = ref(null);

  async function registerApp(payload: RegisterAppFormInput) {
    await service.registerApp(payload);
  }

  async function login(payload: LoginInput) {}

  return {
    session,
    registerApp,
  };
});
