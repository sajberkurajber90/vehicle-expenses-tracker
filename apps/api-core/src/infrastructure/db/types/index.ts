import type { UserTable } from "./user.ts";
import type { PermissionTable } from "./permissions.ts";
import type { RoleTable } from "./roles.ts";
import type {RolePermissionTable} from "./role_permission.ts";
import type {UserRoleTable} from "./user_role.ts";
import {UserPermissionTable} from "./user_permission.ts";

export interface Database {
  users: UserTable;
  permissions: PermissionTable;
  roles: RoleTable;
  role_permission: RolePermissionTable;
  user_role: UserRoleTable;
  user_permission: UserPermissionTable;
}
