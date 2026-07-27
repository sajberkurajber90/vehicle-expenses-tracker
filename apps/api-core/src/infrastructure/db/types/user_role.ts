import type {ColumnType} from "kysely";

export interface UserRoleTable {
    userId: number;
    roleId: number;
    createdAt: ColumnType<Date, string | undefined, never>;
    updatedAt: ColumnType<Date, string | undefined, string>;
}