import {ColumnType} from "kysely";


export interface UserPermissionTable {
    userId: number;
    permissionId: number;
    createdAt: ColumnType<Date, string | undefined, never>;
    updatedAt: ColumnType<Date, string | undefined, string>;
    createdBy: string;
    updatedBy: string;
}