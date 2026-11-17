import { readPort, readString } from '@grpc-monorepo/grpc-core';

export interface IOrdersConfig {
  readonly port: number;
  readonly usersAddress: string;
}

export function loadConfig(): IOrdersConfig {
  return {
    port: readPort('ORDERS_GRPC_PORT', 50052),
    usersAddress: readString('USERS_GRPC_ADDR', 'localhost:50051'),
  };
}
