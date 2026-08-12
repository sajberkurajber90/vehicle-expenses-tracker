import { BetterAuthPlugin } from 'better-auth';
import { createAuthEndpoint } from 'better-auth/api';

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
          handler: async (context) => {
            return context;
          },
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
