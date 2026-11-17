import { readPort } from '@grpc-monorepo/grpc-core';

export interface IUsersConfig {
  readonly port: number;
}

export function loadConfig(): IUsersConfig {
  return { port: readPort('USERS_GRPC_PORT', 50051) };
}
