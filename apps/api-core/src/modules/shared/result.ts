import ApiError from '@modules/shared/errors.ts';

export type Result<T, E extends ApiError> =
  { ok: true; value: T } | { ok: false; error: E };

export type PaginatedResult<T, E extends ApiError> =
  { ok: true; value: T[] } | { ok: false; error: E };
