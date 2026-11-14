import type { IAuthRepository } from '~/features/auth/auth.repository';
import {
  type ConfirmResetPasswordInputRefine,
  type ConfirmResetPasswordRequest,
  type LoginInput,
  type RegisterAppInput,
  type RegisterAppRequest,
  type ResetPasswordInput,
} from '~/features/auth/auth.schema';
import type { z } from 'zod';

export class AuthService {
  constructor(
    private readonly repo: IAuthRepository,
    private readonly validator: {
      registerPayload: z.ZodType<RegisterAppInput>;
      registerAppRequest: z.ZodType<RegisterAppRequest>;
      loginPayload: z.ZodType<LoginInput>;
      resetPasswordPayload: z.ZodType<ResetPasswordInput>;
      confirmResetPasswordPayload: z.ZodType<ConfirmResetPasswordInputRefine>;
      confirmResetPasswordRequest: z.ZodType<ConfirmResetPasswordRequest>;
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

  async resetPassword(email: string, redirectTo: unknown) {
    const validation = this.validator.resetPasswordPayload.safeParse({
      email,
      redirectTo,
    });
    if (!validation.success) {
      return validation.error;
    }

    return await this.repo.resetPassword(
      validation.data.email,
      validation.data.redirectTo,
    );
  }

  async confirmResetPassword(payload: ConfirmResetPasswordInputRefine) {
    const validation =
      this.validator.confirmResetPasswordPayload.safeParse(payload);
    if (!validation.success) {
      return validation.error;
    }

    const dto = this.validator.confirmResetPasswordRequest.safeParse(
      validation.data,
    );
    if (!dto.success) {
      return dto.error;
    }

    return await this.repo.confirmResetPassword(dto.data);
  }
}

export type IAuthService = AuthService;
