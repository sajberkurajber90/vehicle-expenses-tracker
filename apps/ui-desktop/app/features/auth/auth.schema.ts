import { z } from 'zod';

// login
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
export type LoginInput = z.infer<typeof loginSchema>;

// register app
export const registerAppSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/),
  confirmPassword: z.string(),
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

export const registerAppSchemaRefined = registerAppSchema.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  },
);

export const registerAppSchemaCompleted = z.object({
  isRegisterComplete: z.boolean(),
});
export type RegisterAppFormInput = z.infer<typeof registerAppSchema>;
export type RegisterAppRequest = Omit<RegisterAppFormInput, 'confirmPassword'>;

export const registerAppResponseSchema = z.object({
  token: z.string().nullable(),
  user: z.object({
    id: z.coerce.number(),
    email: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
    name: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
  }),
});

export type RegisterAppResponse = z.infer<typeof registerAppResponseSchema>;

// user session
export const userSessionSchema = z.object({
  id: z.number(),
  email: z.string().email(),
});

export type IUserSession = z.infer<typeof userSessionSchema>;
