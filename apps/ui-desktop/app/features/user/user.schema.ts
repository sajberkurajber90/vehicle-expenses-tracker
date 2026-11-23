import { z } from 'zod';

export const userSettingsResponseSchema = z.object({
  id: z.coerce.number(),
  userId: z.coerce.number(),
  theme: z.enum(['light', 'dark', 'system']),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const createUserSettingsInputSchema = z.object({
  userId: z.number().int().positive(),
  theme: z.enum(['light', 'dark', 'system']),
});

export const updateUserSettingsInputSchema = createUserSettingsInputSchema
  .partial()
  .required({ userId: true })
  .extend({
    id: z.number().int().positive(),
  });

export type UserSettingsResponse = z.infer<typeof userSettingsResponseSchema>;
export type CreateUserSettingsInput = z.infer<
  typeof createUserSettingsInputSchema
>;
export type UpdateUserSettingsInput = z.infer<
  typeof updateUserSettingsInputSchema
>;
