import type { IAuthRepository } from '~/features/auth/auth.repository';
import {
  type LoginInput,
  type RegisterAppFormInput,
} from '~/features/auth/auth.schema';
import type { z } from 'zod';

export class AuthService {
  constructor(
    private readonly repo: IAuthRepository,
    private readonly validator: {
      registerPayload: z.ZodType<RegisterAppFormInput>;
      loginPayload: z.ZodType<LoginInput>;
    },
  ) {}

  async registerApp(payload: RegisterAppFormInput) {
    const validation = this.validator.registerPayload.safeParse(payload);
    if (!validation.success) {
      console.log(validation.error?.errors);
    }

    const dto = {
      email: payload.email,
      password: payload.password,
      name: payload.name,
      firstName: payload.firstName,
      lastName: payload.lastName,
    };

    await this.repo.registerApp(dto);
  }

  async login(payload: LoginInput) {
    const validation = this.validator.loginPayload.safeParse(payload);
    if (!validation.success) {
      console.log(validation.error?.errors);
    }
  }
  async logout() {}
}

export type IAuthService = AuthService;
