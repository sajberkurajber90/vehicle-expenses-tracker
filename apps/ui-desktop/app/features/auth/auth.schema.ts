import { z } from 'zod';

const PASSWORD_SCHEMA = z
  .string()
  .min(8)
  .regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/);

// user session
export const authUserResponseSchema = z.object({
  id: z.coerce.number(),
  email: z.email(),
  emailVerified: z.boolean(),
  firstName: z.string(),
  lastName: z.string(),
  name: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullable(),
});

export const authSessionResponseSchema = z.object({
  id: z.uuid(),
  userId: z.coerce.number(),
  token: z.string(),
  expiresAt: z.coerce.date(),
  ipAddress: z.string(),
  userAgent: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const authUserSessionResponseSchema = z
  .object({
    user: authUserResponseSchema,
    session: authSessionResponseSchema,
  })
  .nullable();

export type AuthUserResponse = z.infer<typeof authUserResponseSchema>;
export type AuthSessionResponse = z.infer<typeof authSessionResponseSchema>;
export type AuthUserSessionResponse = z.infer<
  typeof authUserSessionResponseSchema
>;

// login
export const loginInputSchema = z.object({
  email: z.email().nonempty({ message: 'Email is required' }),
  password: z.string().nonempty({ message: 'Password is required' }),
});

export const loginResponseSchema = z.object({
  token: z.string(),
  user: authUserResponseSchema,
});

export type LoginInput = z.infer<typeof loginInputSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;

// logout
export const logoutResponseSchema = z.object({
  success: z.boolean(),
});

export type LogoutResponse = z.infer<typeof logoutResponseSchema>;

// register app
export const registerAppInputSchema = z.object({
  email: z.email(),
  password: PASSWORD_SCHEMA,
  confirmPassword: z.string().nonempty('Confirm password is required'),
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

export const registerAppInputRefineSchema = registerAppInputSchema.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  },
);

export const registerAppRequestSchema = registerAppInputSchema.omit({
  confirmPassword: true,
});

export const registerAppCompleteResponseSchema = z.object({
  isRegisterComplete: z.boolean(),
});

export const registerAppResponseSchema = z.object({
  token: z.string().nullable(),
  user: authUserResponseSchema,
});

export type RegisterAppInput = z.infer<typeof registerAppInputSchema>;
export type RegisterAppRequest = z.infer<typeof registerAppRequestSchema>;
export type RegisterAppResponse = z.infer<typeof registerAppResponseSchema>;

// reset password
export const resetPasswordInputSchema = z.object({
  email: z.email().nonempty(),
  redirectTo: z.url().nonempty(),
});

export const resetPasswordResponseSchema = z.object({
  status: z.boolean(),
  message: z.string(),
});

export type ResetPasswordInput = z.infer<typeof resetPasswordInputSchema>;
export type ResetPasswordResponse = z.infer<typeof resetPasswordResponseSchema>;

// confirm password
export const confirmResetPasswordInputSchema = z.object({
  token: z.string(),
  newPassword: PASSWORD_SCHEMA,
  confirmNewPassword: z.string().nonempty('Confirm new password is required'),
});

export const confirmResetPasswordInputRefineSchema =
  confirmResetPasswordInputSchema
    .pick({
      newPassword: true,
      confirmNewPassword: true,
      token: true,
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
      message: "Passwords don't match",
      path: ['confirmNewPassword'],
    });

export const confirmPasswordRequestSchema =
  confirmResetPasswordInputSchema.omit({
    confirmNewPassword: true,
  });

export const confirmResetPasswordResponseSchema = z.object({
  status: z.boolean(),
});

export type ConfirmResetPasswordInput = z.infer<
  typeof confirmResetPasswordInputSchema
>;

export type ConfirmResetPasswordInputRefine = z.infer<
  typeof confirmResetPasswordInputRefineSchema
>;
export type ConfirmResetPasswordRequest = z.infer<
  typeof confirmPasswordRequestSchema
>;
export type ConfirmResetPasswordResponse = z.infer<
  typeof confirmResetPasswordResponseSchema
>;
