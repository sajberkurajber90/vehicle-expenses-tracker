import {
  rolesConfig,
  type RoleName,
} from '@infrastructure/permissions/config/roles.ts';
import type { PermissionName } from '@infrastructure/db/types/permissions.ts';

type RecordPermission = {
  role: RoleName;
  labels: PermissionName[];
};

export const permissions: RecordPermission[] = rolesConfig.map((role) => {
  switch (role.name) {
    case 'admin':
      return {
        role: role.name,
        labels: [
          'read.role.all',
          'read.permission.all',
          'read.user-settings.own',
          'create.user-settings',
          'update.user-settings.own',
        ],
      };
    case 'user':
      return {
        role: role.name,
        labels: [
          'read.role.own',
          'read.permission.own',
          'read.user-settings.own',
          'create.user-settings',
          'update.user-settings.own',
        ],
      };
    default: {
      throw new Error(`Unhandled role: ${role}`);
    }
  }
});
