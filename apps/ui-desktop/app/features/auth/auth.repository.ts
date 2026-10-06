import {
  type LoginInput,
  type LoginResponse,
  type LogoutResponse,
  type RegisterAppRequest,
  type RegisterAppResponse,
} from '~/features/auth/auth.schema';

import type { z } from 'zod';
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
          issues: validation.error.flatten().fieldErrors,
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
          issues: validation.error.flatten().fieldErrors,
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
          issues: validation.error.flatten().fieldErrors,
        };
      }

      return { data: validation.data };
    } catch (err: unknown) {
      return this.toApiError(err);
    }
  }
}

export type IAuthRepository = AuthRepository;
