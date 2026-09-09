import { authorizationService } from '@modules/authorization/authorization.services.ts';

export const allocateSuperAdminRoleToUser =
  authorizationService.allocateSuperAdminRoleToUser.bind(authorizationService);
