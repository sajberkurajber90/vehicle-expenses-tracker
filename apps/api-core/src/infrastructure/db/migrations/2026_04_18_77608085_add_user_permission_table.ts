import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<never>): Promise<void> {
  await db.schema
    .createTable('user_permission')
    .addColumn('user_id', 'integer', (col) =>
      col.references('users.id').notNull(),
    )
    .addColumn('permission_id', 'integer', (col) =>
      col.references('permissions.id').notNull(),
    )
    .addColumn('granted', 'boolean', (col) => col.notNull().defaultTo(true))
    .addColumn('created_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addColumn('updated_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addColumn('created_by', 'integer', (col) => col.notNull())
    .addColumn('updated_by', 'integer', (col) => col.notNull())
    .addPrimaryKeyConstraint('pk_user_permission', ['user_id', 'permission_id'])
    .execute();
}

export async function down(db: Kysely<never>): Promise<void> {
  await db.schema.dropTable('user_permission').execute();
}
