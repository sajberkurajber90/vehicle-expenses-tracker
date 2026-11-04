import z from 'zod';

export const querySchema = z.object({
  cursor: z
    .base64()
    .transform((val) => Buffer.from(val, 'base64').toString('utf-8'))
    .pipe(z.string())
    .transform((str, ctx) => {
      try {
        return JSON.parse(str);
      } catch {
        ctx.addIssue({ code: 'custom', message: 'Cursor is not valid JSON' });
        return z.NEVER;
      }
    })
    .pipe(
      z.object({
        id: z.number().int().positive(),
        createdAt: z.iso.datetime().transform((val) => new Date(val)),
      }),
    )
    .optional(),
  limit: z.coerce.number().int().positive().optional().default(25),
});

export type QueryParams = z.infer<typeof querySchema>;
