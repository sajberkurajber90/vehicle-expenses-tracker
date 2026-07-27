import { CamelCasePlugin, Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import type { Database } from '@infrastructure/db/types/index.ts';

// TODO: add env
const options = {
  database: 'test',
  host: 'localhost',
  user: 'admin',
  password: 'password',
  port: 5434,
  max: 10,
};

export const pool = new Pool(options);
// TODO: add missing type conversions
// https://github.com/brianc/node-pg-types
// https://kysely.dev/docs/recipes/data-types#mysql

const db = new Kysely<Database>({
  dialect: new PostgresDialect({ pool }),
  plugins: [new CamelCasePlugin()],
});

export default db;
