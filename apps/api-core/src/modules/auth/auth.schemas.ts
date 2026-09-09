import * as z from 'zod';
import { userSchema } from '@modules/app/admin/user.schema.ts';

export const signUpSchema = z.object({
  token: z.string().nullable(),
  user: userSchema,
});
