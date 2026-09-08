import type { IRolesRepository } from '@modules/authorization/repository.ts';

import { rolesRepository } from '@modules/authorization/repository.ts';
import { getUserById, IGetUserById } from '@modules/app/admin/index.ts';

class RolesService {
  constructor(
    private readonly repository: IRolesRepository,
    private readonly getUserById: IGetUserById,
  ) {}

  async allocateSuperAdminRoleToUser(userId: number) {
    const user = await this.getUserById(userId);
    if (!user.ok) {
      return user;
    }

    const role = await this.repository.getRoleByName('super-admin');
    if (!role.ok) {
      return role;
    }

    return user;
  }
}

export type IRolesService = RolesService;
export const rolesService = new RolesService(rolesRepository, getUserById);
