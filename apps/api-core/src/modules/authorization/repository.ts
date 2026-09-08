import type { Kysely } from 'kysely';
import type { Database } from '@infrastructure/db/types/index.ts';
import db from '@infrastructure/db/index.ts';
import { RoleName } from '@infrastructure/permissions/config/roles.ts';
import type { Role } from '@infrastructure/db/types/roles.ts';
import { NotFoundError } from '@modules/shared/errors.ts';
import { Result } from '@modules/shared/result.ts';

export class RolesRepository {
  constructor(private readonly db: Kysely<Database>) {}
  async getAllRoles(): Promise<Role[]> {
    return this.db.selectFrom('roles').selectAll().execute();
  }

  async getRoleByName(
    roleName: RoleName,
  ): Promise<Result<Role, NotFoundError>> {
    const response = await this.db
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
  }
}

export type IRolesRepository = RolesRepository;

export const rolesRepository = new RolesRepository(db);
