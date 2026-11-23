import type { ColumnType } from 'kysely';

export interface RolePermissionTable {
  roleId: ColumnType<number, number, never>;
  permissionId: ColumnType<number, number, never>;
  createdAt: ColumnType<Date, string | undefined, never>;
  updatedAt: ColumnType<Date, string | undefined, string>;
}
