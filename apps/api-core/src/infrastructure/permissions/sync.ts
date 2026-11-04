import db from '@infrastructure/db/index.ts';
import { rolesConfig } from './config/roles.ts';
import { permissions } from './config/permissions.ts';
async function sync() {
  // generate roles
  const roleTrx = await db.startTransaction().execute();
  try {
    for (const role of rolesConfig) {
      await roleTrx
        .insertInto('roles')
        .values({
          name: role.name,
          label: role.label,
        })
        .onConflict((oc) =>
          oc.column('name').doUpdateSet({ label: role.label }),
        )
        .execute();
    }
    await roleTrx.commit().execute();
  } catch (err: unknown) {
    await roleTrx.rollback().execute();
    throw err;
  }

  // generate permissions
  const permissionTrx = await db.startTransaction().execute();
  const availableRoles = await permissionTrx
    .selectFrom('roles')
    .selectAll()
    .execute();
  const uniquePermission = new Set(permissions.map((p) => p.labels).flat());
  try {
    for (const p of uniquePermission) {
      const result = await permissionTrx
        .insertInto('permissions')
        .values({ name: p, label: p })
        .onConflict((oc) => oc.column('name').doUpdateSet({ label: p }))
        .returning(['id'])
        .executeTakeFirstOrThrow();

      // allocate permissions to roles
      for (const role of availableRoles) {
        if (
          !permissions.find((p) => p.role === role.name)?.labels.includes(p)
        ) {
          continue;
        }
        await permissionTrx
          .insertInto('role_permission')
          .values({ roleId: role.id, permissionId: result.id })
          .onConflict((oc) =>
            oc.columns(['roleId', 'permissionId']).doNothing(),
          )
          .executeTakeFirstOrThrow();
      }
    }
    await permissionTrx.commit().execute();
  } catch (err: unknown) {
    await permissionTrx.rollback().execute();
    throw new Error(
      `Failed to sync permissions: ${err instanceof Error ? err.message : 'Unknown error'}`,
    );
  }
}

sync()
  .then(() => {
    console.info('Permissions synced successfully');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Failed to sync permissions', err);
    process.exit(1);
  })
  .finally(async () => {
    await db.destroy();
  });
