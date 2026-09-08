import db from '@infrastructure/db/index.ts';
import type { Database } from '@infrastructure/db/types/index.ts';
import type { Kysely } from 'kysely';
import { Result } from '@modules/shared/result.ts';
import { NotFoundError } from '@modules/shared/errors.ts';
import { User } from '@infrastructure/db/types/user.ts';

class UserRepository {
  constructor(private readonly db: Kysely<Database>) {}

  async getUserById(userId: number): Promise<Result<User, NotFoundError>> {
    const response = await this.db
      .selectFrom('users')
      .selectAll()
      .where('id', '=', userId)
      .executeTakeFirst();
    if (response === undefined) {
      return {
        ok: false,
        error: new NotFoundError(`User with id ${userId} not found`),
      };
    }

    return { ok: true, value: response };
  }
}

export type IUserRepository = UserRepository;

export const userRepository = new UserRepository(db);
