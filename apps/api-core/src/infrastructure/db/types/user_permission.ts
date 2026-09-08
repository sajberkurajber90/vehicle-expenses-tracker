import { ColumnType } from 'kysely';

export interface UserPermissionTable {
  userId: number;
  permissionId: number;
  grant: boolean;
  createdAt: ColumnType<Date, string | undefined, never>;
  updatedAt: ColumnType<Date, string | undefined, string>;
  createdBy: number;
  updatedBy: number;
}
