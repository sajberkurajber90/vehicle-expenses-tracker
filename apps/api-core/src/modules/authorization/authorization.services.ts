import {
  authorizationRepository,
  IAuthorizationRepository,
} from '@modules/authorization/authorization.repository.ts';
import {
  userRepository,
  IUserRepository,
} from '@modules/app/user/user.repository.ts';

class AuthorizationService {
  constructor(
    private readonly repository: IAuthorizationRepository,
    private readonly userRepository: IUserRepository,
  ) {}

  async getRoleByUserId(userId: number) {}
}

export type IAuthorizationService = AuthorizationService;
export const authorizationService = new AuthorizationService(
  authorizationRepository,
  userRepository,
);
