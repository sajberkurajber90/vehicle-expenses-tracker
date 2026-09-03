import type {
  RegisterAppRequest,
  RegisterAppResponse,
} from '~/features/auth/auth.schema';
import { FetchError } from 'ofetch';
type APIFetch = typeof $fetch;

export class AuthRepository {
  constructor(private readonly f: APIFetch) {}

  async registerApp(payload: RegisterAppRequest) {
    try {
      return this.f<RegisterAppResponse>('/auth/sign-up/email', {
        method: 'POST',
        body: payload,
      });
    } catch (err: unknown) {
      if (err instanceof FetchError) {
        console.log('fetch error', err.response, err.cause, err.data);
      }
      console.log('other err', err);
    }
  }

  async getUserSession() {
    return await this.f('/auth/get-session', {
      method: 'GET',
      credentials: 'include',
    });
  }
}

export type IAuthRepository = AuthRepository;
