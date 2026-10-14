import { Kysely } from 'kysely';
import { Database } from '@infrastructure/db/types/index.ts';
import { APIError, betterAuth } from 'better-auth';
import db from '@infrastructure/db/index.ts';
import { SignUpRequest } from './auth.schemas.ts';
import { BetterAuthSharedOptions } from '@modules/auth/config.ts';
import { InfrastructureError } from '@modules/shared/errors.ts';
import { Result } from '@modules/shared/result.ts';

export class AuthRepository {
  constructor(private readonly db: Kysely<Database>) {}
  async initialize(
    body: SignUpRequest,
    trx: Kysely<Database>,
    options: BetterAuthSharedOptions,
  ): Promise<Result<unknown, InfrastructureError>> {
    const scopedAuth = betterAuth({
      database: { db: trx.withoutPlugins(), type: 'postgres' },
      secret: options.secret,
      basePath: options.basePath,
      baseURL: options.baseURL,
      emailVerification: options.emailVerification,
      emailAndPassword: options.emailAndPassword,
      user: options.user,
      account: options.account,
      advanced: {
        database: options.advanced.database,
      },
    });
    try {
      return { ok: true, value: await scopedAuth.api.signUpEmail({ body }) };
    } catch (error: unknown) {
      return {
        ok: false,
        error: new InfrastructureError(
          error instanceof APIError
            ? (error.body?.message ??
                'BETTER AUTH INTERNAL ERROR: ' + error.message)
            : 'Failed to sign up user',
          'AuthRepository.initialize',
        ),
      };
    }
  }
}

export type IAuthRepository = AuthRepository;
export const authRepository = new AuthRepository(db);
