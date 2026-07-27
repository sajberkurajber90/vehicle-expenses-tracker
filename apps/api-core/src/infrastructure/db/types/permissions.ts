import type { ColumnType, Generated, Insertable, Selectable, Updateable } from "kysely";

export interface PermissionTable {
    id: Generated<number>;
    name: string;
    label: `${'create.' | 'update.' | 'delete.'}${string}` | null;
    createdAt: ColumnType<Date, string | undefined, never> ;
    updatedAt: ColumnType<Date, string | undefined, string>;
    deletedAt: ColumnType<Date | null, string | undefined, string | null>;
}

export type Permission = Selectable<PermissionTable>;
export type NewPermission = Insertable<PermissionTable>;
export type UpdatePermission = Updateable<PermissionTable>;