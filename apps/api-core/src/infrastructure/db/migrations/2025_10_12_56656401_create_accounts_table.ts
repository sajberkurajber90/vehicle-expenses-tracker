import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('accounts')
    .addColumn('id', `uuid`, (col) => col.primaryKey())
    .addColumn('user_id', 'integer')
    .addColumn('account_id', `varchar(255)`, (col) => col.notNull())
    .addColumn('provider_id', `varchar(255)`, (col) => col.notNull())
    .addColumn('access_token', `varchar(255)`)
    .addColumn('refresh_token', `varchar(255)`)
    .addColumn('access_token_expires_at', 'timestamptz')
    .addColumn('refresh_token_expires_at', 'timestamptz')
    .addColumn('scope', `varchar(255)`)
    .addColumn('id_token', `varchar(255)`)
    .addColumn('password', `varchar(255)`)
    .addColumn('created_at', `timestamptz`, (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addColumn('updated_at', `timestamptz`, (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('accounts').execute();
}
