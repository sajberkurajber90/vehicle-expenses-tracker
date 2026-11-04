import type {
  ColumnType,
  Generated,
  Insertable,
  Selectable,
  Updateable,
} from 'kysely';

export type PermissionAction = 'create' | 'read' | 'update' | 'delete';
export type PermissionScopedAction = Exclude<PermissionAction, 'create'>; // 'read' | 'update' | 'delete'
export type PermissionScope = 'all' | 'own';
export type PermissionResource = 'role' | 'permission';

export type PermissionName =
  | `create.${PermissionResource}`
  | `${PermissionScopedAction}.${PermissionResource}.${PermissionScope}`;

export interface PermissionTable {
  id: Generated<number>;
  name: string;
  label: PermissionName | null;
  createdAt: ColumnType<Date, string | undefined, never>;
  updatedAt: ColumnType<Date, string | undefined, string>;
  deletedAt: ColumnType<Date | null, string | undefined, string | null>;
}

export type Permission = Selectable<PermissionTable>;
export type NewPermission = Insertable<PermissionTable>;
export type UpdatePermission = Updateable<PermissionTable>;
