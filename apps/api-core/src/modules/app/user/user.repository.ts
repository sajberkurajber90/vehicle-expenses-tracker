import db from '@infrastructure/db/index.ts';
import type { Database } from '@infrastructure/db/types/index.ts';
import type { Kysely } from 'kysely';
import { Result } from '@modules/shared/result.ts';
import { InfrastructureError, NotFoundError } from '@modules/shared/errors.ts';
import { User } from '@infrastructure/db/types/user.ts';
import {
  type CreateUserSettingsPayload,
  UpdateUserSettingsPayload,
} from '@modules/app/user/user.schema.ts';
import { SelectableUserSettings } from '@infrastructure/db/types/user_settings.ts';

export class UserRepository {
  constructor(private readonly db: Kysely<Database>) {}

  async findUserById(
    userId: number,
    trx?: Kysely<Database>,
  ): Promise<Result<User, NotFoundError | InfrastructureError>> {
    try {
      const response = await (trx || this.db)
        .selectFrom('users')
        .selectAll()
        .where('id', '=', userId)
        .where('deletedAt', 'is', null)
        .executeTakeFirst();
      if (response === undefined) {
        return {
          ok: false,
          error: new NotFoundError(`User with id ${userId} not found`),
        };
      }

      return { ok: true, value: response };
    } catch (err: unknown) {
      return {
        ok: false,
        error: new InfrastructureError(
          `Failed to find user with id ${userId}`,
          'userRepository.findUserById',
        ),
      };
    }
  }

  async findUserSettingsByUserId(userId: number) {
    try {
      const response = await this.db
        .selectFrom('user_settings')
        .selectAll()
        .where('userId', '=', userId)
        .executeTakeFirst();

      if (response === undefined) {
        return {
          ok: false,
          error: new NotFoundError(
            `User settings for user with id ${userId} not found`,
          ),
        };
      }

      return { ok: true, value: response };
    } catch (err: unknown) {
      return {
        ok: false,
        error: new InfrastructureError(
          `Failed to find user settings for user with id ${userId}`,
          'userRepository.findUserSettingsByUserId',
        ),
      };
    }
  }

  async createUserSettings(
    payload: CreateUserSettingsPayload,
    trx?: Kysely<Database>,
  ): Promise<Result<SelectableUserSettings, InfrastructureError>> {
    try {
      const response = await (trx || this.db)
        .insertInto('user_settings')
        .values(payload)
        .returningAll()
        .executeTakeFirst();
      if (response === undefined) {
        return {
          ok: false,
          error: new InfrastructureError(
            `Failed to create user settings for user with id ${payload.userId}`,
            'userRepository.createUserSettings',
          ),
        };
      }

      return { ok: true, value: response };
    } catch (e: unknown) {
      return {
        ok: false,
        error: new InfrastructureError(
          `Failed to create user settings for user with id ${payload.userId}`,
          'userRepository.createUserSettings',
        ),
      };
    }
  }

  async updateUserSettings(
    payload: UpdateUserSettingsPayload,
    trx?: Kysely<Database>,
  ) {
    try {
      const { id, userId, ...updateFields } = payload;
      const response = await (trx || this.db)
        .updateTable('user_settings')
        .set({
          ...updateFields,
          updatedAt: new Date(),
        })
        .where('id', '=', id)
        .where('userId', '=', userId)
        .returningAll()
        .executeTakeFirst();
      if (response === undefined) {
        return {
          ok: false,
          error: new NotFoundError(
            `User settings for user with id ${userId} not found`,
          ),
        };
      }
      return { ok: true, value: response };
    } catch (e: unknown) {
      return {
        ok: false,
        error: new InfrastructureError(
          `Failed to update user settings for user with id ${payload.userId}`,
          'userRepository.updateUserSettings',
        ),
      };
    }
  }
}

export type IUserRepository = UserRepository;

export const userRepository = new UserRepository(db);
