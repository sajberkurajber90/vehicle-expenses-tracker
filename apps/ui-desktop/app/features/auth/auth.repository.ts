import type { $Fetch } from 'ofetch';
import type { RegisterAppInput } from '~/features/auth/auth.schema';
import { $fetch } from 'ofetch';

class AuthRepository {
  constructor(private readonly f: $Fetch) {}

  async registerApp(payload: RegisterAppInput) {
    return await this.f('/auth/sign-up', {
      method: 'POST',
      body: payload,
    });
  }

  async getUserSession() {
    return await this.f('/auth/get-session', {
      method: 'GET',
      credentials: 'include',
    });
  }
}

export type IAuthRepository = AuthRepository;
const authRepository = new AuthRepository($fetch);

export default authRepository;
