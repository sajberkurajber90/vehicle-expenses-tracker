import type { Kysely } from 'kysely';
import type { Database } from '@infrastructure/db/types/index.ts';
import db from '@infrastructure/db/index.ts';
import { RoleName } from '@infrastructure/permissions/config/roles.ts';
import type { Role } from '@infrastructure/db/types/roles.ts';
import { InfrastructureError, NotFoundError } from '@modules/shared/errors.ts';
import { Result } from '@modules/shared/result.ts';

export class AuthorizationRepository {
  constructor(private readonly db: Kysely<Database>) {}

  async getRoleByName(
    roleName: RoleName,
    trx?: Kysely<Database> | null,
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
    trx?: Kysely<Database> | null,
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
}

export type IAuthorizationRepository = AuthorizationRepository;

export const authorizationRepository = new AuthorizationRepository(db);
