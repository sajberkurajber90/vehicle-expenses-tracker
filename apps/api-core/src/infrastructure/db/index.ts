import { CamelCasePlugin, Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import type { ClientBase } from 'pg';
import type { Database } from '@infrastructure/db/types/index.ts';

const options = {
  database: process.env.DB_NAME || 'test',
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'user',
  password: process.env.DB_PASSWORD || 'password',
  port: Number(process.env.DB_PORT) || 5434,
  max: 12,
  min: 2,
  onConnect: async (client: ClientBase) => {
    await client.query(`SET search_path TO ${process.env.DB_NAME || 'public'}`);
  },
};

export const pool = new Pool(options);
// https://github.com/brianc/node-pg-types
// https://kysely.dev/docs/recipes/data-types#mysql

const db = new Kysely<Database>({
  dialect: new PostgresDialect({ pool }),
  plugins: [new CamelCasePlugin()],
});

export default db;
