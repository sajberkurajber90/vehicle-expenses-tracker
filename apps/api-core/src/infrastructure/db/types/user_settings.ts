import type {
  ColumnType,
  Generated,
  Insertable,
  Selectable,
  Updateable,
} from 'kysely';

export type Theme = 'dark' | 'light' | 'system';

export interface UserSettingsTable {
  id: Generated<number>;
  userId: ColumnType<number, number, never>;
  theme: ColumnType<Theme, Theme, Theme>;
  createdAt: ColumnType<Date, string | undefined, never>;
  updatedAt: ColumnType<Date, string | undefined, Date>;
}

export type InsertableUserSettings = Insertable<UserSettingsTable>;
export type SelectableUserSettings = Selectable<UserSettingsTable>;
export type UpdateableUserSettings = Updateable<UserSettingsTable>;
