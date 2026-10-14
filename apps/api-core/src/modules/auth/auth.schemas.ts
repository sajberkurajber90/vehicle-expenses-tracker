import * as z from 'zod';

const authUserResponseSchema = z.object({
  id: z.coerce.number(),
  email: z.string().email(),
  name: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  emailVerified: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullable(),
});

const authUserSessionResponseSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  userId: z.coerce.number(),
  expiresAt: z.coerce.date(),
  token: z.string(),
  ipAddress: z.string().nullable().optional(),
  userAgent: z.string().nullable().optional(),
});

export const sessionResponseSchema = z.object({
  session: authUserSessionResponseSchema,
  user: authUserResponseSchema,
});

export type SessionResponse = z.infer<typeof sessionResponseSchema>;

export const signUpRequestSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/),
  name: z.string(),
  firstName: z
    .string()
    .min(2, { message: 'At least 2 characters' })
    .regex(/^[A-ZÀ-Ý][a-zà-ÿ]*(?:[-' ][A-ZÀ-Ý][a-zà-ÿ]*)*$/, {
      message: 'Each part must start with an uppercase letter',
    }),
  lastName: z
    .string()
    .min(2, { message: 'At least 2 characters' })
    .regex(/^[A-ZÀ-Ý][a-zà-ÿ]*(?:[-' ][A-ZÀ-Ý][a-zà-ÿ]*)*$/, {
      message: 'Each part must start with an uppercase letter',
    }),
});

export type SignUpRequest = z.infer<typeof signUpRequestSchema>;
export const signUpResponseSchema = z.object({
  token: z.string().nullable(),
  user: authUserResponseSchema,
});
export type SignUpResponse = z.infer<typeof signUpResponseSchema>;
