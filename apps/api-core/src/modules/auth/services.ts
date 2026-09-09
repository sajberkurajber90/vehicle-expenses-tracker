import { APIError, BetterAuthPlugin } from 'better-auth';
import { createAuthEndpoint, createAuthMiddleware } from 'better-auth/api';
import { signUpSchema } from '@modules/auth/auth.schemas.ts';
import { allocateSuperAdminRoleToUser } from '@modules/authorization/index.ts';

// app registration - first user registration (guards sign-up route)
export const canSignUp = () => {
  return {
    id: 'can-sign-up',
    hooks: {
      before: [
        {
          matcher: (context) => {
            return context.path === '/sign-up/email';
          },
          handler: createAuthMiddleware(async (context) => {
            const usersCount = await context.context.adapter.count({
              model: 'users',
            });

            if (usersCount > 0) {
              throw new APIError('FORBIDDEN', {
                message:
                  'Sign-up is not allowed. The application is already registered.',
              });
            }
          }),
        },
      ],
      after: [
        {
          matcher: (context) => {
            return context.path === '/sign-up/email';
          },
          handler: createAuthMiddleware(async (context) => {
            const response = context.context.returned;
            const parsed = signUpSchema.safeParse(response);
            if (!parsed.success) {
              throw new APIError('CONFLICT', {
                message:
                  'Parsing sign-up response failed. The response does not match the expected schema.',
              });
            }

            const { user } = parsed.data;
            await allocateSuperAdminRoleToUser(user.id);
          }),
        },
      ],
    },
  } satisfies BetterAuthPlugin;
};

// user activation
export const canActivateUser = () => {
  return {
    id: 'can-activate-user',
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
