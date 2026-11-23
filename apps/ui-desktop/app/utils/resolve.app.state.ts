export type AppState =
  | 'unregistered'
  | 'needs-login'
  | 'needs-user-settings'
  | 'authenticated'
  | 'error';

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
  'needs-user-settings': {
    redirectTo: '/set-user-settings',
  },
  authenticated: {
    redirectTo: '/',
  },
  error: {
    redirectTo: '/error',
  },
};
