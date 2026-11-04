import { z } from 'zod';
export type Result<T> = {
  data: T;
};

export function cursorSchema<T extends z.ZodType>(schema: T) {
  return z.object({
    next: z.base64().nullable(),
    prev: z.base64().nullable(),
    data: z.array(schema),
  });
}

export type CursorResponse<T extends z.ZodType> = z.infer<
  ReturnType<typeof cursorSchema<T>>
>;

export type CursorSchemaType<T extends z.ZodType> = ReturnType<
  typeof cursorSchema<T>
>;
