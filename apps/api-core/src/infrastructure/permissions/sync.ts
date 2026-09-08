import db from '@infrastructure/db/index.ts';
import { rolesConfig } from './config/roles.ts';

async function syncPermission() {
  for (const role of rolesConfig) {
    await db
      .insertInto('roles')
      .values({
        name: role.name,
        label: role.label,
      })
      .onConflict((oc) => oc.column('name').doUpdateSet({ label: role.label }))
      .execute();
  }
}


syncPermission()
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