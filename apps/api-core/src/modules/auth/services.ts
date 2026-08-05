import { BetterAuthPlugin } from 'better-auth';

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
            console.log('call the hook');
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
