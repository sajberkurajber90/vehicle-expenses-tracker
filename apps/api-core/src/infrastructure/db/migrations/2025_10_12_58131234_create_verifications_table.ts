import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('verifications')
    .addColumn('id', `uuid`, (col) => col.primaryKey())
    .addColumn('identifier', `varchar(255)`, (col) => col.notNull())
    .addColumn('value', `varchar(255)`, (col) => col.notNull())
    .addColumn('expires_at', 'timestamptz', (col) => col.notNull())
    .addColumn('created_at', `timestamptz`, (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addColumn('updated_at', `timestamptz`, (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('verifications').execute();
}
