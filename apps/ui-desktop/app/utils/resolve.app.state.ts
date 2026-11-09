export type AppState =
  'unregistered' | 'needs-login' | 'authenticated' | 'error';

type RoutePolicy = {
  allow: (path: string) => boolean;
  redirectTo: string;
};

export const policies: Record<AppState, RoutePolicy> = {
  unregistered: {
    allow: (path) => path === '/register-app',
    redirectTo: '/register-app',
  },
  'needs-login': {
    allow: (path) => ['/login', '/verify-email'].includes(path),
    redirectTo: '/login',
  },
  authenticated: {
    allow: (path) =>
      !['/login', '/register-app', '/verify-email'].includes(path),
    redirectTo: '/',
  },
  error: {
    allow: (path) => path === '/error',
    redirectTo: '/error',
  },
};
