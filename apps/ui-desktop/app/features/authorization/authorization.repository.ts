import type { ApiError } from '~/utils/error';
import type { RoleResponse } from '~/features/authorization/authorization.schema';
import { z } from 'zod';
type APIFetch = typeof $fetch;

export class AuthorizationRepostory {
  constructor(
    private readonly f: APIFetch,
    private readonly toApiError: (err: unknown) => ApiError,
    private readonly responseValidator: {
      roleResponseSchema: z.ZodType<RoleResponse>;
    },
  ) {}

  async findRoleByUserId(
    userId: number,
  ): Promise<Result<RoleResponse> | ApiError> {
    try {
      const response = await this.f<unknown>(
        `/authorization/user/${userId}/roles`,
      );
      const parse =
        this.responseValidator.roleResponseSchema.safeParse(response);
      if (!parse.success) {
        return {
          kind: 'response-parse',
          message: 'Failed to parse role response',
          issues: z.flattenError(parse.error).fieldErrors,
        };
      }
      if (parse.data === undefined) {
        return {
          kind: 'not-found',
          message: 'Role not found for user with id ${userId}',
        };
      }

      return { data: parse.data };
    } catch (e: unknown) {
      return this.toApiError(e);
    }
  }
}

export type IAuthorizationRepostory = AuthorizationRepostory;
