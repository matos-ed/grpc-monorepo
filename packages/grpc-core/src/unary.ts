import { status, type handleUnaryCall, type ServerUnaryCall } from '@grpc/grpc-js';
import { GrpcError, isServiceError, toServerError } from './errors';
import { logger } from './logger';

export type UnaryHandler<Req, Res> = (request: Req, call: ServerUnaryCall<Req, Res>) => Promise<Res>;

interface IKnownFailure {
  readonly code: status;
  readonly details: string;
}

function toKnownFailure(error: unknown): IKnownFailure | null {
  if (isServiceError(error)) return { code: error.code, details: error.details };
  if (error instanceof GrpcError) return { code: error.code, details: error.message };
  return null;
}

/**
 * Adapts an async handler to grpc-js's callback API.
 * Thrown `GrpcError`s keep their status, `ServiceError`s from downstream gRPC calls are
 * propagated with their original code, and anything else becomes `INTERNAL` (logged).
 */
export function unary<Req, Res>(handler: UnaryHandler<Req, Res>): handleUnaryCall<Req, Res> {
  return (call, callback) => {
    const method = call.getPath();
    const startedAt = performance.now();
    const durationMs = (): number => Math.round(performance.now() - startedAt);

    handler(call.request, call).then(
      (response) => {
        logger.info({ method, code: status[status.OK], durationMs: durationMs() }, 'rpc handled');
        callback(null, response);
      },
      (error: unknown) => {
        const known = toKnownFailure(error);
        if (known) {
          logger.info({ method, code: status[known.code], details: known.details, durationMs: durationMs() }, 'rpc failed');
          callback(toServerError(known.code, known.details));
          return;
        }
        logger.error({ method, code: status[status.INTERNAL], err: error, durationMs: durationMs() }, 'rpc crashed');
        callback(toServerError(status.INTERNAL, 'Internal error'));
      },
    );
  };
}
