import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('user_role')
    .addColumn('user_id', 'integer', (col) =>
      col.references('users.id').notNull(),
    )
    .addColumn('role_id', 'integer', (col) =>
      col.references('roles.id').notNull(),
    )
    .addColumn('created_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addColumn('updated_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addPrimaryKeyConstraint('pk_user_role', ['user_id', 'role_id'])
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('user_role').execute();
}
