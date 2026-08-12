import type {
  Generated,
  ColumnType,
  Insertable,
  Selectable,
  Updateable,
} from 'kysely';
// import roles from "../../permissions/config/roles.json"  with { type: 'json' };

type RoleName = 'super-admin' | 'admin' | 'user' | 'guest';

export interface RoleTable {
  id: Generated<number>;
  name: RoleName | null;
  label: string;
  createdAt: ColumnType<Date, string | undefined, never>;
  updatedAt: ColumnType<Date, string | undefined, string>;
  deletedAt: ColumnType<Date | null, string | undefined, string | null>;
}

export type Role = Selectable<RoleTable>;
export type NewRole = Insertable<RoleTable>;
export type UpdateRole = Updateable<RoleTable>;
