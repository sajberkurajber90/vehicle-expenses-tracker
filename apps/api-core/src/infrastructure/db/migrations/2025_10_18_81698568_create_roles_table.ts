import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<never>): Promise<void> {
  await db.schema
    .createTable('roles')
    .addColumn('id', `serial`, (col) => col.primaryKey())
    .addColumn('name', `varchar(255)`, (col) => col.notNull().unique())
    .addColumn('label', `varchar(255)`)
    .addColumn('created_at', `timestamptz`, (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addColumn('updated_at', `timestamptz`, (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addColumn('deleted_at', `timestamptz`, (col) => col.defaultTo(null))
    .execute();
}

export async function down(db: Kysely<never>): Promise<void> {
  await db.schema.dropTable('roles').execute();
}
