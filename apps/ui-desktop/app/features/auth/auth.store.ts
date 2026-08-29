import type { IAuthService } from '~/features/auth/auth.service';
import { authService } from '~/features/auth/auth.service';
import type { RegisterAppInput } from '~/features/auth/auth.schema';

function createAuthStore(service: IAuthService) {
  return defineStore('auth', {
    state: () => ({
      user: null,
    }),
    actions: {
      async registerApp(payload: RegisterAppInput) {},
    },
  });
}

export const useAuthStore = createAuthStore(authService);
