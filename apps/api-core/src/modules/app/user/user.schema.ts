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

export type IUser = z.infer<typeof userResponseSchema>;
