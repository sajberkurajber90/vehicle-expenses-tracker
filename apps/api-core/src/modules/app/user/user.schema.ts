import * as z from 'zod';

export const userResponseSchema = z.object({
  id: z.coerce.number(),
  email: z.email(),
  name: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  emailVerified: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullable(),
});

export const createUserSettngsSchema = z.object({
  userId: z.coerce.number().int().positive(),
  theme: z.enum(['light', 'dark', 'system']),
});

export const updateUserSettingsSchema = createUserSettngsSchema
  .partial()
  .extend({
    id: z.coerce.number().int().positive(),
  })
  .required({ id: true, userId: true });

export type IUser = z.infer<typeof userResponseSchema>;
export type CreateUserSettingsPayload = z.infer<typeof createUserSettngsSchema>;
export type UpdateUserSettingsPayload = z.infer<
  typeof updateUserSettingsSchema
>;
