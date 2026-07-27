import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs/promises';

async function main(args) {
  if (args.length < 1) {
    throw Error('pass at least one argument: the name of the migration');
  } else if (args.length > 1) {
    throw Error('pass only one argument: the name of the migration');
  }

  // no numbers or special characters allowed - except dashes and underscores
  const name = args[0].toLowerCase();
  if (!/^[a-zA-Z_-]+$/.test(name)) {
    throw Error(
      'the name of the migration must only contain alphanumeric characters, dashes or underscores',
    );
  }

  // use iso 8081 date format to create a timestamp for the migration
  const date = new Date().toISOString().replace(/-/g, '_').split('T')[0];

  const __scriptName = fileURLToPath(import.meta.url);
  const __dirName = path.dirname(__scriptName);

  const now = new Date();
  const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const msSinceMidnight = now.getTime() - midnight.getTime();

  const res = [date, msSinceMidnight, name].reduce((acc, cur) => {
    return acc + '_' + cur;
  });

  const fileName = res + '.ts';

  const content = `
import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
        
           throw new Error('Not implemented yet');
        
        }
        
export async function down(db: Kysely<any>): Promise<void> {
        
            throw new Error('Not implemented yet');
        
        }
    `;

  await fs.writeFile(
    path.join(__dirName, '../../infrastructure/db/migrations/', fileName),
    content,
  );

  return `Migration file created: ${fileName}`;
}

main(process.argv.slice(2))
  .then((res) => console.info(res))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
