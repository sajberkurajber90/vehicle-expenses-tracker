import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerAppSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/),
  confirmPassword: z.string(),
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

export type RegisterAppInput = z.infer<typeof registerAppSchema>;

export const userSessionSchema = z.object({
  id: z.number(),
  email: z.string().email(),
});

export type IUserSession = z.infer<typeof userSessionSchema>;

export type AuthError = {
  message: string;
  code: number;
};
