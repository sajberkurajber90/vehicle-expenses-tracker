import type { IAuthRepository } from '~/features/auth/auth.repository';
import {
  type LoginInput,
  type RegisterAppInput,
  type RegisterAppRequest,
} from '~/features/auth/auth.schema';
import type { z } from 'zod';

export class AuthService {
  constructor(
    private readonly repo: IAuthRepository,
    private readonly validator: {
      registerPayload: z.ZodType<RegisterAppInput>;
      registerAppRequest: z.ZodType<RegisterAppRequest>;
      loginPayload: z.ZodType<LoginInput>;
    },
  ) {}

  async registerApp(payload: RegisterAppInput) {
    const validation = this.validator.registerPayload.safeParse(payload);
    if (!validation.success) {
      return validation.error;
    }

    // omit confirmPassword from payload to create a request DTO
    const dto = this.validator.registerAppRequest.safeParse(validation.data);

    if (dto.success) {
      return await this.repo.registerApp(dto.data);
    } else {
      return dto.error;
    }
  }

  async login(payload: LoginInput) {
    const validation = this.validator.loginPayload.safeParse(payload);
    if (!validation.success) {
      return validation.error;
    }

    return await this.repo.login(payload);
  }
  async logout() {
    return await this.repo.logout();
  }

  async resetPassword(email: string) {}
}

export type IAuthService = AuthService;
