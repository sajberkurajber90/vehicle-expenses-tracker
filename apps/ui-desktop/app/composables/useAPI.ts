import { useAuthStore } from '~/features/auth/auth.store';
import { z } from 'zod';
import { toApiError, type ApiError } from '~/utils/error';
import { cursorSchema, type CursorSchemaType } from '~/utils/result';
export function useAPI() {
  const config = useRuntimeConfig();
  const { cleanUpOnLogout } = useAuthStore();

  const fetch = $fetch.create({
    baseURL: import.meta.server
      ? config.apiInternalBase
      : config.public.apiBase,
    credentials: 'include',
    onRequest: ({ options }) => {
      if (import.meta.server) {
        const headers = useRequestHeaders(['cookie']);
        if (headers && headers['cookie']) {
          options.headers.set('cookie', headers['cookie']);
        }
      }
    },
    async onResponse({ response }) {
      // only on client side - for redirect purposes
      if (import.meta.client && response.status === 401) {
        await navigateTo('/login');
        await cleanUpOnLogout();
      }
    },
  });

  function fetchCursorPage<T extends z.ZodType>(
    url: string,
    schema: CursorSchemaType<T>,
    options?: Parameters<typeof fetch>[1] & Parameters<typeof useAsyncData>[2],
  ) {
    const key = `${url}-${JSON.stringify(options?.query)}`;

    return useAsyncData<CursorResponse<T> | ApiError>(
      key,
      async (): Promise<CursorResponse<T> | ApiError> => {
        try {
          const response = await fetch<unknown>(url, options);
          const validation = schema.safeParse(response);
          if (!validation.success) {
            return {
              kind: 'response-parse',
              message: 'Failed to parse cursor response',
              issues: z.flattenError(validation.error).fieldErrors,
            };
          }

          return validation.data;
        } catch (err: unknown) {
          return toApiError(err);
        }
      },
    );
  }

  function fetchRecord<T extends z.ZodType>(
    url: string,
    schema: T,
    options?: Parameters<typeof fetch>[1] & Parameters<typeof useAsyncData>[2],
  ) {
    const key = `${url}-${JSON.stringify(options?.query)}`;

    return useAsyncData<Result<z.infer<T>> | ApiError>(
      key,
      async (): Promise<Result<z.infer<T>> | ApiError> => {
        try {
          const response = await fetch<unknown>(url, options);
          const validation = schema.safeParse(response);
          if (!validation.success) {
            console.log(z.flattenError(validation.error));
            return {
              kind: 'response-parse',
              message: 'Failed to parse record response',
              issues: z.flattenError(validation.error).fieldErrors as Record<
                string,
                string[]
              >,
            };
          }

          return { data: validation.data };
        } catch (err: unknown) {
          return toApiError(err);
        }
      },
    );
  }

  return {
    fetch,
    fetchCursorPage,
    fetchRecord,
  };
}
