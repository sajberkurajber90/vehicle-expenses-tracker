import type { ColumnType, Generated, Selectable } from "kysely";

export interface UserTable {
  id: Generated<number>;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  emailVerified: boolean;
  createdAt: ColumnType<Date, string | undefined, never>;
  updatedAt: ColumnType<Date, string | undefined, string>;
  deletedAt: ColumnType<Date | null, string | undefined, string | null>;
}


export type User = Selectable<UserTable>