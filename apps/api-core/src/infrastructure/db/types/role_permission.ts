import type { ColumnType } from 'kysely';

export interface RolePermissionTable {
    roleId: number;
    permissionId: number;
    createdAt: ColumnType<Date, string | undefined, never>;
    updatedAt: ColumnType<Date, string | undefined, string>;
}