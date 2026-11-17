import {
  credentials,
  type CallOptions,
  type ChannelCredentials,
  type Client,
  type ClientOptions,
  type ClientUnaryCall,
  type requestCallback,
} from '@grpc/grpc-js';

const DEFAULT_DEADLINE_MS = 3_000;

type ClientConstructor<C extends Client> = new (
  address: string,
  credentials: ChannelCredentials,
  options?: ClientOptions,
) => C;

export interface ICallOptions {
  readonly deadlineMs?: number;
}

export function createClient<C extends Client>(Ctor: ClientConstructor<C>, address: string): C {
  return new Ctor(address, credentials.createInsecure());
}

/**
 * Turns a callback-style unary call into a Promise with a deadline.
 * `invoke` must forward both arguments to the client method:
 * `callUnary<User>((options, cb) => client.getUser({ id }, options, cb))`.
 * Rejects with the original `ServiceError`, so its status code is preserved.
 */
export function callUnary<Res>(
  invoke: (options: CallOptions, callback: requestCallback<Res>) => ClientUnaryCall,
  { deadlineMs = DEFAULT_DEADLINE_MS }: ICallOptions = {},
): Promise<Res> {
  return new Promise((resolve, reject) => {
    invoke({ deadline: Date.now() + deadlineMs }, (error, response) => {
      if (error) reject(error);
      else if (response === undefined) reject(new Error('gRPC call returned no response'));
      else resolve(response);
    });
  });
}
