import { FetchError } from 'ofetch';

type BaseError = {
  message: string;
  kind:
    | 'bad-request'
    | 'validation'
    | 'not-found'
    | 'authentication'
    | 'authorization'
    | 'domain'
    | 'infrastructure'
    | 'response-parse';
};

export type BadRequest = BaseError & {
  kind: 'bad-request';
  message: string;
};

export type ValidationErr = BaseError & {
  kind: 'validation';
  issues: Partial<Record<string, string[]>>;
};

export type NotFoundErr = BaseError & {
  kind: 'not-found';
};

export type AuthenticationErr = BaseError & {
  kind: 'authentication';
};

export type AuthorizationErr = BaseError & {
  kind: 'authorization';
};

export type DomainErr = BaseError & {
  kind: 'domain';
  code: string;
};

export type InfrastructureErr = BaseError & {
  kind: 'infrastructure';
  code: string;
  statusCode: number;
};

export type ResponseParseErr = BaseError & {
  kind: 'response-parse';
  issues: Partial<Record<string, string[]>>;
};

export type ApiError =
  | BadRequest
  | ValidationErr
  | NotFoundErr
  | DomainErr
  | InfrastructureErr
  | AuthenticationErr
  | AuthorizationErr
  | ResponseParseErr;

export function toApiError(err: unknown): ApiError {
  if (err instanceof FetchError) {
    switch (err.statusCode) {
      case 400:
        return {
          kind: 'bad-request',
          message: err.data?.message ?? 'Bad request',
        };
      case 401:
        return {
          kind: 'authentication',
          message: err.data?.message ?? 'Unauthorized',
        };
      case 403:
        return {
          kind: 'authorization',
          message: err.data?.message ?? 'Forbidden',
        };
      case 404:
        return {
          kind: 'not-found',
          message: err.data?.message ?? 'Not found',
        };
      case 409:
      case 422:
        return {
          kind: 'domain',
          message: err.data?.message ?? 'Domain error',
          code: err.data?.code ?? 'DOMAIN_ERROR',
        };
      default:
        return {
          kind: 'infrastructure',
          message: err.data?.message ?? 'Unknown error',
          code: err.data?.code ?? 'INFRASTRUCTURE_ERROR',
          statusCode: err.statusCode ?? 500,
        };
    }
  }

  return {
    kind: 'infrastructure',
    message: (err as Error).message ?? 'Unknown error',
    code: 'INFRASTRUCTURE_ERROR',
    statusCode: 500,
  };
}
