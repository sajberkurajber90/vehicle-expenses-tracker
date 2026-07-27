import { pool } from '@infrastructure/db/index.ts';
import { betterAuth } from 'better-auth';

process.env.BETTER_AUTH_SECRET || console.warn('BETTER_AUTH_SECRET is not set');

const auth = betterAuth({
  database: pool,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
});

export default auth;
