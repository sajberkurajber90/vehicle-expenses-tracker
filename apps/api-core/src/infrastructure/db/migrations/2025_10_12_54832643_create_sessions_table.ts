import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('sessions')
    .addColumn('id', `uuid`, (col) => col.primaryKey())
    .addColumn('user_id', 'integer')
    .addColumn('token', `varchar(255)`, (col) => col.notNull().unique())
    .addColumn('expires_at', 'timestamptz', (col) => col.notNull())
    .addColumn('ip_address', `varchar(255)`)
    .addColumn('user_agent', `varchar(255)`)
    .addColumn('created_at', `timestamptz`, (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addColumn('updated_at', `timestamptz`, (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('sessions').execute();
}
