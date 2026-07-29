import { CamelCasePlugin, Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import type { Database } from '@infrastructure/db/types/index.ts';

const options = {
  database: process.env.DB_NAME || 'vet',
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'user',
  password: process.env.DB_PASSWORD || 'password',
  port: Number(process.env.DB_PORT) || 5434,
  max: 12,
  min: 2,
};

export const pool = new Pool(options);
// https://github.com/brianc/node-pg-types
// https://kysely.dev/docs/recipes/data-types#mysql

const db = new Kysely<Database>({
  dialect: new PostgresDialect({ pool }),
  plugins: [new CamelCasePlugin()],
});

export default db;
