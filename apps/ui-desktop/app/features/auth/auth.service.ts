import type { IAuthRepository } from '~/features/auth/auth.repository';
import authRepository from '~/features/auth/auth.repository';
import {
  type LoginInput,
  loginSchema,
  type RegisterAppInput,
  registerAppSchemaRefined,
} from '~/features/auth/auth.schema';
import type { z } from 'zod';

class AuthService {
  constructor(
    private readonly repo: IAuthRepository,
    private readonly validator: {
      registerPayload: z.ZodType<RegisterAppInput>;
      loginPayload: z.ZodType<LoginInput>;
    },
  ) {}

  async registerApp(payload: RegisterAppInput) {
    const validation = this.validator.registerPayload.safeParse(payload);
  }

  async login(payload: LoginInput) {}
  async logout() {}
}

export const authService = new AuthService(authRepository, {
  registerPayload: registerAppSchemaRefined,
  loginPayload: loginSchema,
});
export type IAuthService = AuthService;
