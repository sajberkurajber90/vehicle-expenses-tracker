import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('role_permission')
    .addColumn('role_id', 'integer', (col) =>
      col.references('roles.id').notNull(),
    )
    .addColumn('permission_id', 'integer', (col) =>
      col.references('permissions.id').notNull(),
    )
    .addColumn('created_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addColumn('updated_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addPrimaryKeyConstraint('pk_role_permission', ['role_id', 'permission_id'])
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('role_permission').execute();
}
