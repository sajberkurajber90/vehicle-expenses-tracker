import { Kysely } from 'kysely';
import { Database } from '@infrastructure/db/types/index.ts';

class Repository {
  constructor(
    private readonly db: Kysely<Database>,
    private readonly cache: any,
  ) {}

  async isAppInit(): Promise<boolean> {
    return false;
  }

  async isUserValid(userId: string): Promise<boolean> {
    return true;
  }
}
