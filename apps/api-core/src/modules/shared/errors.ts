export default class ApiError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
  ) {
    super(message);
  }
}

export class NotFoundError extends ApiError {
  readonly code = 'NOT_FOUND';
  constructor(
    message: string,
    public origin?: string,
  ) {
    super(message, 404);
  }
}

export class AuthorizationError extends ApiError {
  readonly code = 'PERMISSION_DENIED';
  constructor(
    message: string,
    public origin?: string,
  ) {
    super(message, 403);
  }
}

export class ValidationError extends ApiError {
  readonly code = 'VALIDATION_ERROR';
  constructor(
    message: string,
    public origin?: string,
  ) {
    super(message, 400);
  }
}

export class InfrastructureError extends ApiError {
  readonly code = 'INFRASTRUCTURE_ERROR';
  constructor(
    message: string,
    public origin?: string,
  ) {
    super(message, 500);
  }
}
