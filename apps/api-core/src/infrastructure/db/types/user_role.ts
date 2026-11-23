import type { ColumnType, Insertable, Selectable, Updateable } from 'kysely';

export interface UserRoleTable {
  userId: ColumnType<number, number, never>;
  roleId: ColumnType<number, number, never>;
  createdAt: ColumnType<Date, string | undefined, never>;
  updatedAt: ColumnType<Date, string | undefined, string>;
}

export type UserRole = Selectable<UserRoleTable>;
export type NewUserRole = Insertable<UserRoleTable>;
