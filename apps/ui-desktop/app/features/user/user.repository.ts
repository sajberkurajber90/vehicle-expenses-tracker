import type { ApiError } from '~/utils/error';
import type {
  CreateUserSettingsInput,
  UserSettingsResponse,
} from '~/features/user/user.schema';
import { z } from 'zod';
type APIFetch = typeof $fetch;

export class UserRepository {
  constructor(
    private readonly f: APIFetch,
    private readonly toApiError: (err: unknown) => ApiError,
    private readonly responseValidator: {
      userSettingsResponseSchema: z.ZodType<UserSettingsResponse>;
    },
  ) {}

  async findUserSettingsByUserId(
    userId: number,
  ): Promise<Result<UserSettingsResponse> | ApiError> {
    try {
      const response = await this.f<unknown>(`/user/${userId}/settings`);
      const parse =
        this.responseValidator.userSettingsResponseSchema.safeParse(response);
      if (!parse.success) {
        return {
          kind: 'response-parse',
          message: 'Failed to parse user settings response',
          issues: z.flattenError(parse.error).fieldErrors,
        };
      }
      return { data: parse.data };
    } catch (e: unknown) {
      return this.toApiError(e);
    }
  }
  async createUserSettings(
    payload: CreateUserSettingsInput,
  ): Promise<Result<UserSettingsResponse> | ApiError> {
    try {
      const response = await this.f<unknown>(`/user/settings`, {
        body: payload,
        method: 'POST',
      });
      const parse =
        this.responseValidator.userSettingsResponseSchema.safeParse(response);
      if (!parse.success) {
        return {
          kind: 'response-parse',
          message: 'Failed to parse user settings response',
          issues: z.flattenError(parse.error).fieldErrors,
        };
      }
      return { data: parse.data };
    } catch (e: unknown) {
      return this.toApiError(e);
    }
  }
}

export type IUserRepository = UserRepository;
