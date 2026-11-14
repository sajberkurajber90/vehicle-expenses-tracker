import db, { pool } from '@infrastructure/db/index.ts';
import { betterAuth, type ModelNames } from 'better-auth';
import { redis } from '@infrastructure/redis/index.ts';
import {
  disableSignUp,
  appRegisterComplete,
  initialSignUp,
} from './auth.services.ts';
import { authRepository } from './auth.repository.ts';
import { authorizationRepository } from '@modules/authorization/authorization.repository.ts';
import { signUpRequestSchema, signUpResponseSchema } from './auth.schemas.ts';
import { sendMail } from '@infrastructure/mail/index.ts';

const sharedOptions = {
  secret: process.env.BETTER_AUTH_SECRET,
  basePath: '/auth',
  baseURL: `https://${process.env.API_PREFIX}.${process.env.BASE_URL}`,
  trustedOrigins: [
    `https://${process.env.BASE_URL}`,
    `https://${process.env.UI_MOBILE_PREFIX}.${process.env.BASE_URL}`,
  ],
  emailVerification: {
    sendOnSignIn: false,
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    revokeSessionsOnPasswordChange: true,
  },
  advanced: {
    database: {
      // generate uuid only for non-user tabel
      generateId: (options: {
        model: ModelNames;
        size?: number | undefined;
      }) => {
        if (options.model === 'users' || options.model === 'user') {
          return false;
        }

        return crypto.randomUUID();
      },
    },
  },
  user: {
    modelName: 'users',
    fields: {
      emailVerified: 'email_verified',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
    additionalFields: {
      firstName: {
        type: 'string',
        required: true,
        input: true,
        maxLength: 50,
        fieldName: 'firstname',
      },
      lastName: {
        type: 'string',
        required: true,
        input: true,
        maxLength: 50,
        fieldName: 'lastname',
      },
      deletedAt: {
        type: 'date',
        required: false,
        input: false,
        fieldName: 'deleted_at',
      },
    },
  },
  account: {
    modelName: 'accounts',
    fields: {
      userId: 'user_id',
      accountId: 'account_id',
      providerId: 'provider_id',
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
      accessTokenExpiresAt: 'access_token_expires_at',
      refreshTokenExpiresAt: 'refresh_token_expires_at',
      idToken: 'id_token',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
} as const;

export type BetterAuthSharedOptions = typeof sharedOptions;

const auth = betterAuth({
  plugins: [
    disableSignUp(),
    appRegisterComplete(),
    initialSignUp(db, sharedOptions, authRepository, authorizationRepository, {
      request: signUpRequestSchema,
      response: signUpResponseSchema,
    }),
  ],
  database: pool,
  secret: sharedOptions.secret,
  basePath: sharedOptions.basePath,
  baseURL: sharedOptions.baseURL,
  trustedOrigins: [
    `https://${process.env.BASE_URL}`,
    `https://${process.env.UI_MOBILE_PREFIX}.${process.env.BASE_URL}`,
  ],
  secondaryStorage: {
    get: async (key) => {
      return await redis.get(key);
    },
    getAndDelete: async (key) => {
      return await redis.getDel(key);
    },
    set: async (key, value, ttl) => {
      if (ttl) await redis.set(key, value, { EX: ttl });
      else await redis.set(key, value);
    },
    async increment(key, ttl) {
      if (!Number.isInteger(ttl) || ttl <= 0) {
        throw new TypeError('Redis increment TTL must be a positive integer');
      }
      const [value] = await redis
        .multi()
        .incr(key)
        .expire(key, ttl, 'NX')
        .execTyped();
      return value;
    },
    delete: async (key) => {
      await redis.del(key);
    },
  },
  user: sharedOptions.user,
  session: {
    modelName: 'sessions',
    fields: {
      userId: 'user_id',
      expiresAt: 'expires_at',
      ipAddress: 'ip_address',
      userAgent: 'user_agent',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
  account: sharedOptions.account,
  verification: {
    modelName: 'verifications',
    fields: {
      expiresAt: 'expires_at',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
  emailAndPassword: {
    ...sharedOptions.emailAndPassword,
    sendResetPassword: async ({ user, url, token }, request) => {
      const redirectTo = `https://${process.env.BASE_URL}/verify-email/reset-password?token=${token}`;
      await sendMail(
        user.email,
        'Reset your password',
        `<h2>Dear ${user.name},</h2>
               <p>Please verify your email by clicking the following link: <a href="${redirectTo}">Verify</a></p>`,
      );
    },
  },
  emailVerification: sharedOptions.emailVerification,
  advanced: {
    crossSubDomainCookies: {
      enabled: true,
      domain: `${process.env.BASE_URL}`,
    },
    useSecureCookies: true,
    defaultCookieAttributes: {
      sameSite: 'none',
      secure: true,
      httpOnly: true,
    },
    database: sharedOptions.advanced.database,
  },
});

export type BetterAuthClient = typeof auth;
export default auth;
