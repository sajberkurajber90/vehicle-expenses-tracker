import { z } from 'zod';

export const roleResponseSchema = z.object({
  id: z.coerce.number(),
  name: z.string(),
  label: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullable(),
});
export type RoleResponse = z.infer<typeof roleResponseSchema>;

export const permissionResponseSchema = z.object({
  id: z.coerce.number(),
  name: z.string(),
  label: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullable(),
});

export type PermissionResponse = z.infer<typeof permissionResponseSchema>;
