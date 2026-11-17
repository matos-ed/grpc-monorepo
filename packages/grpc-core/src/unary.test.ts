import { Metadata, status, type ServerErrorResponse, type ServerUnaryCall, type ServiceError } from '@grpc/grpc-js';
import { describe, expect, it } from 'vitest';
import { invalidArgument } from './errors';
import { unary, type UnaryHandler } from './unary';

interface IOutcome {
  readonly error: Partial<ServerErrorResponse> | null;
  readonly response: string | null | undefined;
}

function invoke(handler: UnaryHandler<string, string>): Promise<IOutcome> {
  const call = { request: 'ping', getPath: () => '/test.v1.Test/Ping' } as unknown as ServerUnaryCall<string, string>;
  return new Promise((resolve) => {
    unary(handler)(call, (error, response) => resolve({ error, response }));
  });
}

describe('unary', () => {
  it('should send the handler response', async () => {
    const outcome = await invoke(async (request) => `${request}-pong`);

    expect(outcome).toEqual({ error: null, response: 'ping-pong' });
  });

  it('should map a GrpcError to its status code', async () => {
    const outcome = await invoke(async () => {
      throw invalidArgument('bad input');
    });

    expect(outcome.error).toMatchObject({ code: status.INVALID_ARGUMENT, details: 'bad input' });
  });

  it('should propagate the code of a downstream ServiceError', async () => {
    const downstream: ServiceError = Object.assign(new Error('5 NOT_FOUND: user missing'), {
      code: status.NOT_FOUND,
      details: 'user missing',
      metadata: new Metadata(),
    });

    const outcome = await invoke(async () => {
      throw downstream;
    });

    expect(outcome.error).toMatchObject({ code: status.NOT_FOUND, details: 'user missing' });
  });

  it('should hide unexpected errors behind INTERNAL', async () => {
    const outcome = await invoke(async () => {
      throw new Error('db password leaked in message');
    });

    expect(outcome.error).toMatchObject({ code: status.INTERNAL, details: 'Internal error' });
  });
});
