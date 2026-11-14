import { APIError, BetterAuthPlugin } from 'better-auth';
import { createAuthEndpoint, createAuthMiddleware } from 'better-auth/api';
import { type BetterAuthSharedOptions } from './config.ts';
import { IAuthRepository } from '@modules/auth/auth.repository.ts';
import z from 'zod';
import {
  type SignUpRequest,
  SignUpResponse,
} from '@modules/auth/auth.schemas.ts';
import { Kysely } from 'kysely';
import { Database } from '@infrastructure/db/types/index.ts';
import { IAuthorizationRepository } from '@modules/authorization/authorization.repository.ts';
import { createEmailVerificationToken } from 'better-auth/api';
import { sendMail } from '@infrastructure/mail/index.ts';

// disable the sign-up route to prevent users from signing up through the default better-auth route
export const disableSignUp = () => {
  return {
    id: 'disable-sign-up',
    hooks: {
      before: [
        {
          matcher: (context) => {
            return context.path === '/sign-up/email';
          },
          handler: createAuthMiddleware(async (context) => {
            throw new APIError('NOT_FOUND', {
              message: 'Route not found',
            });
          }),
        },
      ],
    },
  } satisfies BetterAuthPlugin;
};

export const appRegisterComplete = () => {
  return {
    id: 'app-register-complete',
    endpoints: {
      getIsRegisterComplete: createAuthEndpoint(
        '/app-register-complete',
        {
          method: 'GET',
        },
        async (endpoint) => {
          const usersCount = await endpoint.context.adapter.count({
            model: 'users',
          });

          return endpoint.json({
            isRegisterComplete: usersCount > 0,
          });
        },
      ),
    },
  } satisfies BetterAuthPlugin;
};

// initial sign-up route for the first user registration
export function initialSignUp(
  db: Kysely<Database>,
  sharedOptions: BetterAuthSharedOptions,
  repository: IAuthRepository,
  authorizationRepository: IAuthorizationRepository,
  validator: {
    request: z.ZodType<SignUpRequest>;
    response: z.ZodType<SignUpResponse>;
  },
) {
  return {
    id: 'initial-sign-up',
    hooks: {
      before: [
        {
          matcher: (context) => {
            return context.path === '/initial-sign-up';
          },
          handler: createAuthMiddleware(async (context) => {
            const usersCount = await context.context.adapter.count({
              model: 'users',
            });
            if (usersCount > 0) {
              throw new APIError('FORBIDDEN', {
                message: 'Initial sign-up is only allowed for the first user',
              });
            }
          }),
        },
      ],
      after: [
        {
          matcher: (context) => {
            return context.path === '/initial-sign-up';
          },
          handler: createAuthMiddleware(async (context) => {
            const response = context.context.returned;
            const user = validator.response.safeParse(response);
            if (!user.success) {
              // TODO: error on failed email sent - log
              return;
            }
            try {
              const token = await createEmailVerificationToken(
                sharedOptions.secret as string,
                user.data.user.email,
              );
              const url = `https://${process.env.BASE_URL}/verify-email?token=${token}`;
              await sendMail(
                user.data.user.email,
                'Email Verification',
                `<h2>Dear ${user.data.user.firstName}</h2>
                       <p>Please verify your email by clicking the following link: <a href="${url}">Verify</a></p>`,
              );
            } catch (e) {
              return;
            }
          }),
        },
      ],
    },
    endpoints: {
      initialSignUp: createAuthEndpoint(
        '/initial-sign-up',
        {
          method: 'POST',
        },
        async (endpoint) => {
          const input = validator.request.safeParse(endpoint.body);

          if (!input.success) {
            throw new APIError('BAD_REQUEST', {
              message: 'Invalid request body',
              details: z.flattenError(input.error).fieldErrors,
            });
          }

          const trx = await db.startTransaction().execute();
          const newUserRaw = await repository.initialize(
            input.data,
            trx,
            sharedOptions,
          );

          if (!newUserRaw.ok) {
            await trx.rollback().execute();
            throw new APIError('INTERNAL_SERVER_ERROR', {
              message: newUserRaw.error.message,
              details: newUserRaw.error.origin,
            });
          }

          const newUser = validator.response.safeParse(newUserRaw.value);

          if (!newUser.success) {
            await trx.rollback().execute();
            throw new APIError('INTERNAL_SERVER_ERROR', {
              message: 'Failed to parse better-auth sign-up response',
              details: z.flattenError(newUser.error).fieldErrors,
            });
          }

          const roleId = await authorizationRepository.getRoleByName(
            'admin',
            trx,
          );

          if (!roleId.ok) {
            await trx.rollback().execute();
            throw new APIError('INTERNAL_SERVER_ERROR', {
              message: roleId.error.message,
              details: roleId.error.origin,
            });
          }

          const allocateUserRole =
            await authorizationRepository.allocateRoleToUser(
              newUser.data.user.id,
              roleId.value.id,
              trx,
            );

          if (!allocateUserRole.ok) {
            await trx.rollback().execute();
            throw new APIError('INTERNAL_SERVER_ERROR', {
              message: allocateUserRole.error.message,
              details: allocateUserRole.error.origin,
            });
          }

          await trx.commit().execute();

          return endpoint.json(newUser.data);
        },
      ),
    },
  } satisfies BetterAuthPlugin;
}
