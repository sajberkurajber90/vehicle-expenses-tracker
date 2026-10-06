import type { IAuthorizationRepository } from '@modules/authorization/authorization.repository.ts';

import { rolesRepository } from '@modules/authorization/authorization.repository.ts';
import { getUserById, IGetUserById } from '@modules/app/admin/index.ts';

class AuthorizationService {
  constructor(
    private readonly repository: IAuthorizationRepository,
    private readonly getUserById: IGetUserById,
  ) {}

  async allocateSuperAdminRoleToUser(userId: number) {
    const user = await this.getUserById(userId);
    if (!user.ok) {
      return user;
    }

    const role = await this.repository.getRoleByName('admin');
    if (!role.ok) {
      return role;
    }

    await this.repository.allocateRoleToUser(userId, role.value.id);

    return user;
  }
}

export type IAuthorizationService = AuthorizationService;
export const authorizationService = new AuthorizationService(
  rolesRepository,
  getUserById,
);
