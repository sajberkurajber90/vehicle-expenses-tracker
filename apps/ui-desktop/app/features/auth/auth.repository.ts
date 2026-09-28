import type {
  LoginInput,
  RegisterAppRequest,
  RegisterAppResponse,
} from '~/features/auth/auth.schema';
import { FetchError } from 'ofetch';
type APIFetch = typeof $fetch;

export class AuthRepository {
  constructor(private readonly f: APIFetch) {}

  async registerApp(payload: RegisterAppRequest) {
    try {
      return await this.f<RegisterAppResponse>('/auth/sign-up/email', {
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

  async login(payload: LoginInput): Promise<unknown> {
    try {
      return await this.f<unknown>('/auth/sign-in/email', {
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

  async logout() {
    try {
      return await this.f<void>('/auth/sign-out', {
        method: 'POST',
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
    });
  }
}

export type IAuthRepository = AuthRepository;
