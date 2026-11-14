export type AppState =
  'unregistered' | 'needs-login' | 'authenticated' | 'error';

type RoutePolicy = {
  redirectTo: string;
};

export const policies: Record<AppState, RoutePolicy> = {
  unregistered: {
    redirectTo: '/register-app',
  },
  'needs-login': {
    redirectTo: '/login',
  },
  authenticated: {
    redirectTo: '/',
  },
  error: {
    redirectTo: '/error',
  },
};
