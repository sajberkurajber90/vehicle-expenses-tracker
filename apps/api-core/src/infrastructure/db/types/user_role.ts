import type { ColumnType, Insertable, Selectable } from 'kysely';

export interface UserRoleTable {
  userId: number;
  roleId: number;
  createdAt: ColumnType<Date, string | undefined, never>;
  updatedAt: ColumnType<Date, string | undefined, string>;
}

export type UserRole = Selectable<UserRoleTable>;
export type NewUserRole = Insertable<UserRoleTable>;
