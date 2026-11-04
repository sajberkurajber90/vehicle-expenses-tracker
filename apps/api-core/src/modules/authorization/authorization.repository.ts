import { Kysely, TableExpressionOrList } from 'kysely';
import type { Database } from '@infrastructure/db/types/index.ts';
import db from '@infrastructure/db/index.ts';
import { RoleName } from '@infrastructure/permissions/config/roles.ts';
import type { Role } from '@infrastructure/db/types/roles.ts';
import { InfrastructureError, NotFoundError } from '@modules/shared/errors.ts';
import { PaginatedResult, Result } from '@modules/shared/result.ts';
import type {
  Permission,
  PermissionName,
} from '@infrastructure/db/types/permissions.ts';
import { QueryParams } from '@modules/shared/schema.ts';

export class AuthorizationRepository {
  constructor(private readonly db: Kysely<Database>) {}

  // TODO: rename to findRoleByUserId
  async getRoleByName(
    roleName: RoleName,
    trx?: Kysely<Database>,
  ): Promise<Result<Role, NotFoundError | InfrastructureError>> {
    try {
      const response = await (trx || this.db)
        .selectFrom('roles')
        .selectAll()
        .where('name', '=', roleName)
        .executeTakeFirst();
      if (response === undefined) {
        return {
          ok: false,
          error: new NotFoundError(`Role with name ${roleName} not found`),
        };
      }

      return { ok: true, value: response };
    } catch (err: unknown) {
      return {
        ok: false,
        error: new InfrastructureError(
          err instanceof Error
            ? err.message
            : 'Unknown error occurred while fetching role by name',
          'AuthorizationRepository.getRoleByName',
        ),
      };
    }
  }

  async allocateRoleToUser(
    userId: number,
    roleId: number,
    trx?: Kysely<Database>,
  ): Promise<Result<undefined, InfrastructureError>> {
    try {
      await (trx || this.db)
        .insertInto('user_role')
        .values({
          userId: userId,
          roleId: roleId,
        })
        .executeTakeFirst();

      return {
        ok: true,
        value: undefined,
      };
    } catch (err: unknown) {
      return {
        ok: false,
        error: new InfrastructureError(
          `Failed to allocate role with id ${roleId} to user with id ${userId}`,
          err instanceof Error ? err.message : undefined,
        ),
      };
    }
  }

  async findRoleByUserId(
    userId: number,
    trx?: Kysely<Database>,
  ): Promise<Result<Role, NotFoundError | InfrastructureError>> {
    try {
      const response = await (trx || this.db)
        .selectFrom('user_role')
        .where('user_role.userId', '=', userId)
        .innerJoin('roles', 'user_role.roleId', 'roles.id')
        .select([
          'roles.id',
          'roles.name',
          'roles.label',
          'roles.createdAt',
          'roles.updatedAt',
          'roles.deletedAt',
        ])
        .executeTakeFirst();
      if (response === undefined) {
        return {
          ok: false,
          error: new NotFoundError(`Role for user with id ${userId} not found`),
        };
      }
      return { ok: true, value: response };
    } catch (err: unknown) {
      return {
        ok: false,
        error: new InfrastructureError(
          err instanceof Error
            ? err.message
            : 'Unknown error occurred while fetching role by user id',
          'AuthorizationRepository.findRoleByUserId',
        ),
      };
    }
  }

  async findPermissionsByUserId(
    userId: number,
    query: QueryParams,
    trx?: Kysely<Database>,
  ): Promise<PaginatedResult<Permission, InfrastructureError>> {
    try {
      const { cursor, limit } = query;
      const mainQuery = (trx || this.db)
        .selectFrom('user_role as ur')
        .where('ur.userId', '=', userId)
        .innerJoin('role_permission as rp', 'ur.roleId', 'rp.roleId')
        .innerJoin('permissions as p', 'rp.permissionId', 'p.id')
        .orderBy('p.id', 'desc')
        .orderBy('p.createdAt', 'desc');

      if (cursor) {
        const responseForward = await mainQuery
          .where('p.id', '<=', cursor.id)
          .where('p.createdAt', '<=', cursor.createdAt)
          .limit(limit + 1)
          .select([
            'p.id',
            'p.name',
            'p.label',
            'p.createdAt',
            'p.updatedAt',
            'p.deletedAt',
          ])
          .execute();

        const cursorForward =
          responseForward.length === limit + 1 ? responseForward.pop() : null;

        const responseBackward = await mainQuery
          .where('p.id', '>', cursor.id)
          .where('p.createdAt', '>', cursor.createdAt)
          .limit(limit)
          .select(['p.id', 'p.createdAt'])
          .execute();

        return {
          ok: true,
          value: responseForward,
          previousCursor:
            responseBackward.length > 0
              ? Buffer.from(
                  JSON.stringify({
                    id: responseBackward[responseBackward.length - 1].id,
                    createdAt:
                      responseBackward[responseBackward.length - 1].createdAt,
                  }),
                ).toString('base64')
              : null,
          nextCursor: cursorForward
            ? Buffer.from(
                JSON.stringify({
                  id: cursorForward.id,
                  createdAt: cursorForward.createdAt,
                }),
              ).toString('base64')
            : null,
        };
      }

      const response = await mainQuery
        .limit(limit + 1)
        .select([
          'p.id',
          'p.name',
          'p.label',
          'p.createdAt',
          'p.updatedAt',
          'p.deletedAt',
        ])
        .execute();

      const cursorForward =
        response.length === limit + 1 ? response.pop() : null;

      return {
        ok: true,
        value: response,
        previousCursor: null,
        nextCursor: cursorForward
          ? Buffer.from(
              JSON.stringify({
                id: cursorForward.id,
                createdAt: cursorForward.createdAt,
              }),
            ).toString('base64')
          : null,
      };
    } catch (err: unknown) {
      return {
        ok: false,
        error: new InfrastructureError(
          err instanceof Error
            ? err.message
            : 'Unknown error occurred while fetching permissions by user id',
          'AuthorizationRepository.findPermissionsByUserId',
        ),
      };
    }
  }

  async hasPermission(
    userId: number,
    permissionName: PermissionName,
    trx?: Kysely<Database>,
  ): Promise<Result<boolean, NotFoundError | InfrastructureError>> {
    try {
      const q = await (trx || this.db)
        .selectFrom('user_role as ur')
        .where('ur.userId', '=', userId)
        .innerJoin('role_permission as rp', 'ur.roleId', 'rp.roleId')
        .innerJoin('permissions as p', 'rp.permissionId', 'p.id')
        .where('p.name', '=', permissionName)
        .select([
          'ur.userId',
          'p.name as permissionName',
          'rp.roleId',
          'p.id as permissionId',
        ])
        .execute();

      if (q.length === 0) {
        return {
          ok: false,
          error: new NotFoundError(
            `Permission ${permissionName} not found for user with id ${userId}`,
          ),
        };
      }
      return {
        ok: true,
        value: true,
      };
    } catch (e: unknown) {
      return {
        ok: false,
        error: new InfrastructureError(
          e instanceof Error
            ? e.message
            : 'Unknown error occurred while checking permission',
          'AuthorizationRepository.hasPermission',
        ),
      };
    }
  }

  async hasOwnership(
    table: TableExpressionOrList<Database, never>,
    resourceId: number,
    trx?: Kysely<Database>,
  ): Promise<Result<number, InfrastructureError | NotFoundError>> {
    switch (table) {
      case 'users':
        try {
          const ownershipCheck = await (trx || this.db)
            .selectFrom(table)
            .where('id', '=', resourceId)
            .select(['id'])
            .executeTakeFirst();
          if (ownershipCheck === undefined) {
            return {
              ok: false,
              error: new NotFoundError(
                `Resource with id ${resourceId} not found in table ${table}`,
              ),
            };
          }
          return {
            ok: true,
            value: ownershipCheck.id,
          };
        } catch (e) {
          return {
            ok: false,
            error: new InfrastructureError(
              e instanceof Error
                ? e.message
                : 'Unknown error occurred while checking ownership',
              `AuthorizationRepository.hasOwnership case -> ${table}`,
            ),
          };
        }

      default:
        return {
          ok: false,
          error: new InfrastructureError(
            `Ownership check not implemented for table ${table}`,
          ),
        };
    }
  }
}

export type IAuthorizationRepository = AuthorizationRepository;

export const authorizationRepository = new AuthorizationRepository(db);
