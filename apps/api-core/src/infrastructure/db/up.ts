import { FileMigrationProvider, Migrator } from 'kysely';
import fs from 'node:fs/promises';
import path from 'node:path';
import db from './index.ts';
import { fileURLToPath } from 'node:url';

const migrator = new Migrator({
  db,
  provider: new FileMigrationProvider({
    fs,
    migrationFolder: path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      './migrations',
    ),
    path,
  }),
});

migrator
  .migrateUp()
  .then((res) => {
    res?.results?.forEach((it) => {
      if (it.status === 'Success') {
        console.info(
          `migration "${it.migrationName}" was executed successfully`,
        );
      } else if (it.status === 'Error') {
        console.error(`failed to execute migration "${it.migrationName}"`);
      }
    });
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
