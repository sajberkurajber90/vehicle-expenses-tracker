import { BetterAuthPlugin } from 'better-auth';
import { createAuthEndpoint } from 'better-auth/api';

// app registration - first user registration (guards sign-up route)
export const canCreateSuperAdmin = () => {
  return {
    id: 'can-create-super-admin',
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

export const registerComplete = () => {
  return {
    id: 'register-complete',
    endpoints: {
      getIsRegisterComplete: createAuthEndpoint(
        '/register-complete',
        {
          method: 'GET',
        },
        async (ctx) => {
          return ctx.json({ isRegisterComplete: true });
        },
      ),
    },
  };
};
