import { pool } from '@infrastructure/db/index.ts';
import { sendMail } from '@infrastructure/mail/index.ts';
import { betterAuth } from 'better-auth';

process.env.BETTER_AUTH_SECRET || console.warn('BETTER_AUTH_SECRET is not set');

const auth = betterAuth({
  database: pool,
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: `https://${process.env.BASE_URL}`,
  trustedOrigins: [
    `https://${process.env.BASE_URL}`,
    `https://${process.env.UI_MOBILE_PREFIX}.${process.env.BASE_URL}`,
  ],
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
    },
  },
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
  verification: {
    modelName: 'verifications',
    fields: {
      expiresAt: 'expires_at',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignIn: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      await sendMail(
        user.email,
        'Verify your email',
        `Click the link to verify your email: ${url}`,
      );
    },
  },
  advanced: {
    defaultCookieAttributes: {
      sameSite: 'none',
      secure: true,
      httpOnly: true,
    },
    database: {
      // generate uuid only for non-user tabel
      generateId: (options) => {
        if (options.model === 'users' || options.model === 'user') {
          return false;
        }

        return crypto.randomUUID();
      },
    },
  },
});

export default auth;
