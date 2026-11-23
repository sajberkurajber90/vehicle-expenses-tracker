import type {
  Generated,
  ColumnType,
  Insertable,
  Selectable,
  Updateable,
} from 'kysely';
import type { RoleName } from '@infrastructure/permissions/config/roles.ts';

export interface RoleTable {
  id: Generated<number>;
  name: ColumnType<RoleName | null, RoleName | null, never>;
  label: ColumnType<string, string, string>;
  createdAt: ColumnType<Date, string | undefined, never>;
  updatedAt: ColumnType<Date, string | undefined, string>;
  deletedAt: ColumnType<Date | null, string | undefined, string | null>;
}

export type Role = Selectable<RoleTable>;
export type NewRole = Insertable<RoleTable>;
export type UpdateRole = Updateable<RoleTable>;
