import {
  authorizationRepository,
  IAuthorizationRepository,
} from '@modules/authorization/authorization.repository.ts';
import {
  userRepository,
  IUserRepository,
} from '@modules/app/user/user.repository.ts';
import {
  type PermissionScopedAction,
  type PermissionAction,
  type PermissionName,
  PermissionResource,
} from '@infrastructure/db/types/permissions.ts';
import assert from 'node:assert';
import {
  InfrastructureError,
  NotFoundError,
  UnauthorizedError,
} from '@modules/shared/errors.ts';
import { Database } from '@infrastructure/db/types/index.ts';
import { Kysely, TableExpressionOrList } from 'kysely';
import { Result } from '@modules/shared/result.ts';
import db from '@infrastructure/db/index.ts';
import { QueryParams } from '@modules/shared/schema.ts';

class AuthorizationService {
  constructor(
    private readonly db: Kysely<Database>,
    private readonly repository: IAuthorizationRepository,
    private readonly userRepository: IUserRepository,
  ) {}

  async findRoleByUserId(userId: number) {
    const userResult = await this.userRepository.findUserById(userId);
    if (!userResult.ok) {
      return userResult;
    }

    const roleResult = await this.repository.findRoleByUserId(userId);
    if (!roleResult.ok) {
      return roleResult;
    }

    return roleResult;
  }

  async findPermissionsByUserId(userId: number, query: QueryParams) {
    const userResult = await this.userRepository.findUserById(userId);
    if (!userResult.ok) {
      return userResult;
    }

    return await this.repository.findPermissionsByUserId(userId, query);
  }

  async findPermissionById(permissionId: number) {}

  async checkPermission(
    sessionUserId: number,
    action: PermissionScopedAction | PermissionAction,
    resource: PermissionResource,
    resourceId?: number,
    table?: TableExpressionOrList<Database, never>,
  ): Promise<
    Result<boolean, InfrastructureError | UnauthorizedError | NotFoundError>
  > {
    assert(
      action === 'create' || (resourceId !== undefined && table !== undefined),
      'OwnerId and table must be provided for non-create actions',
    );

    if (
      resourceId !== undefined &&
      table !== undefined &&
      action !== 'create'
    ) {
      const permissionNameAll: PermissionName = `${action}.${resource}.all`;
      const all = await this.repository.hasPermission(
        sessionUserId,
        permissionNameAll,
      );

      if (all.ok || (!all.ok && all.error instanceof InfrastructureError)) {
        return all;
      }

      const permissionNameOwn: PermissionName = `${action}.${resource}.own`;
      const own = await this.repository.hasPermission(
        sessionUserId,
        permissionNameOwn,
      );

      if (own.ok) {
        const ownership = await this.repository.hasOwnership(table, resourceId);
        if (ownership.ok) {
          const { value: id } = ownership;
          if (id !== sessionUserId) {
            return {
              ok: false,
              error: new UnauthorizedError(
                `User with id ${sessionUserId} is not the owner of resource with id ${resourceId} in table ${table}`,
              ),
            };
          }
        }
        return own;
      } else {
        return own;
      }
    }

    const permissionName: PermissionName = `create.${resource}`;
    return await this.repository.hasPermission(sessionUserId, permissionName);
  }
}

export type IAuthorizationService = AuthorizationService;
export const authorizationService = new AuthorizationService(
  db,
  authorizationRepository,
  userRepository,
);

export const checkPermissionService =
  authorizationService.checkPermission.bind(authorizationService);
export type CheckPermission = typeof checkPermissionService;
