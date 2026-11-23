import { ColumnType } from 'kysely';
import { UserSettingsTable } from '@infrastructure/db/types/user_settings.ts';

export interface UserPermissionTable {
  userId: ColumnType<number, number, never>;
  permissionId: ColumnType<number, number, never>;
  granted: ColumnType<boolean, boolean, boolean>;
  createdAt: ColumnType<Date, string | undefined, never>;
  updatedAt: ColumnType<Date, string | undefined, string>;
  createdBy: ColumnType<number, number, never>;
  updatedBy: ColumnType<number, number, number>;
}
