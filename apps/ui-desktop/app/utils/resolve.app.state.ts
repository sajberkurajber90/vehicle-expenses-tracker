import type { AuthUserResponse } from '~/features/auth';

type AppState = 'unregistered' | 'needs-login' | 'authenticated';

type RoutePolicy = {
  allow: (path: string) => boolean;
  redirectTo: string;
};

export default function resolveAppState(
  session: AuthUserResponse | null,
  isRegisterComplete: boolean,
): AppState {
  if (!isRegisterComplete) {
    return 'unregistered';
  }

  if (session === null) {
    return 'needs-login';
  }

  return 'authenticated';
}

export const policies: Record<AppState, RoutePolicy> = {
  unregistered: {
    allow: (path) => path === '/register-app',
    redirectTo: '/register-app',
  },
  'needs-login': {
    allow: (path) => path === '/login' || path === '/verify-email',
    redirectTo: '/login',
  },
  authenticated: {
    allow: (path) =>
      path !== '/login' && path !== '/register-app' && path !== '/verify-email',
    redirectTo: '/',
  },
};
