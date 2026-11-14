import {
  type ConfirmResetPasswordRequest,
  type ConfirmResetPasswordResponse,
  type LoginInput,
  type LoginResponse,
  type LogoutResponse,
  type RegisterAppRequest,
  type RegisterAppResponse,
  type ResetPasswordResponse,
} from '~/features/auth/auth.schema';

import { z } from 'zod';
import { type ApiError } from '~/utils/error';
import type { Result } from '~/utils/result';
type APIFetch = typeof $fetch;

export class AuthRepository {
  constructor(
    private readonly f: APIFetch,
    private readonly toApiError: (err: unknown) => ApiError,
    private readonly responseValidator: {
      logoutResponseSchema: z.ZodType<LogoutResponse>;
      loginResponseSchema: z.ZodType<LoginResponse>;
      registerAppResponseSchema: z.ZodType<RegisterAppResponse>;
      resetPasswordResponseSchema: z.ZodType<ResetPasswordResponse>;
      confirmResetPasswordResponseSchema: z.ZodType<ConfirmResetPasswordResponse>;
    },
  ) {}

  async registerApp(
    payload: RegisterAppRequest,
  ): Promise<Result<RegisterAppResponse> | ApiError> {
    try {
      const response = await this.f<unknown>('/auth/sign-up/email', {
        method: 'POST',
        body: payload,
      });

      const validation =
        this.responseValidator.registerAppResponseSchema.safeParse(response);

      if (!validation.success) {
        return {
          kind: 'response-parse',
          message: 'Failed to parse register app response',
          issues: z.flattenError(validation.error).fieldErrors,
        };
      }

      return { data: validation.data };
    } catch (err: unknown) {
      return this.toApiError(err);
    }
  }

  async login(payload: LoginInput): Promise<Result<LoginResponse> | ApiError> {
    try {
      const response = await this.f<unknown>('/auth/sign-in/email', {
        method: 'POST',
        body: payload,
      });

      const validation =
        this.responseValidator.loginResponseSchema.safeParse(response);

      if (!validation.success) {
        return {
          kind: 'response-parse',
          message: 'Failed to parse login response',
          issues: z.flattenError(validation.error).fieldErrors,
        };
      }

      return {
        data: validation.data,
      };
    } catch (err: unknown) {
      return this.toApiError(err);
    }
  }

  async logout(): Promise<Result<LogoutResponse> | ApiError> {
    try {
      const response = await this.f<unknown>('/auth/sign-out', {
        method: 'POST',
      });

      const validation =
        this.responseValidator.logoutResponseSchema.safeParse(response);

      if (!validation.success) {
        return {
          kind: 'response-parse',
          message: 'Failed to parse logout response',
          issues: z.flattenError(validation.error).fieldErrors,
        };
      }

      return { data: validation.data };
    } catch (err: unknown) {
      return this.toApiError(err);
    }
  }

  async resetPassword(
    email: string,
    redirectTo: string,
  ): Promise<Result<ResetPasswordResponse> | ApiError> {
    try {
      const response = await this.f<unknown>('/auth/request-password-reset', {
        method: 'POST',
        body: { email, redirectTo },
      });

      const validation =
        this.responseValidator.resetPasswordResponseSchema.safeParse(response);

      if (!validation.success) {
        return {
          kind: 'response-parse',
          message: 'Failed to parse reset password response',
          issues: z.flattenError(validation.error).fieldErrors,
        };
      }

      return { data: validation.data };
    } catch (err: unknown) {
      return this.toApiError(err);
    }
  }
  async confirmResetPassword(
    payload: ConfirmResetPasswordRequest,
  ): Promise<Result<ConfirmResetPasswordResponse> | ApiError> {
    try {
      const response = await this.f<unknown>('/auth/reset-password', {
        method: 'POST',
        body: payload,
      });
      const parsedResponse =
        this.responseValidator.confirmResetPasswordResponseSchema.safeParse(
          response,
        );

      if (!parsedResponse.success) {
        return {
          kind: 'response-parse',
          message: 'Failed to parse confirm reset password response',
          issues: z.flattenError(parsedResponse.error).fieldErrors,
        };
      }

      return { data: parsedResponse.data };
    } catch (e: unknown) {
      return this.toApiError(e);
    }
  }
}

export type IAuthRepository = AuthRepository;
