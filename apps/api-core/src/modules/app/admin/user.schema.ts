import * as z from 'zod';

export const userSchema = z.object({
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

export type IUser = z.infer<typeof userSchema>;
