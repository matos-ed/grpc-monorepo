import { status, type ServerErrorResponse, type ServiceError } from '@grpc/grpc-js';

export class GrpcError extends Error {
  constructor(
    readonly code: status,
    message: string,
  ) {
    super(message);
    this.name = 'GrpcError';
  }
}

export const notFound = (message: string): GrpcError => new GrpcError(status.NOT_FOUND, message);

export const invalidArgument = (message: string): GrpcError =>
  new GrpcError(status.INVALID_ARGUMENT, message);

export function isServiceError(error: unknown): error is ServiceError {
  return (
    error instanceof Error &&
    typeof (error as Partial<ServiceError>).code === 'number' &&
    'metadata' in error
  );
}

export function toServerError(code: status, details: string): ServerErrorResponse {
  return Object.assign(new Error(details), { code, details });
}
