import { OrderService } from '@grpc-monorepo/contracts-orders';
import { startServer, type IRunningServer } from '@grpc-monorepo/grpc-core';
import { createOrderHandlers } from './orders.handlers';
import { InMemoryOrderRepository } from './orders.repository';
import { GrpcUsersGateway } from './users.client';

export interface IOrdersServiceOptions {
  readonly port: number;
  readonly usersAddress: string;
  readonly host?: string;
  readonly handleSignals?: boolean;
}

export function startOrdersService(options: IOrdersServiceOptions): Promise<IRunningServer> {
  const usersGateway = new GrpcUsersGateway(options.usersAddress);
  const implementation = createOrderHandlers({ users: usersGateway, orders: new InMemoryOrderRepository() });

  return startServer({
    name: 'orders-service',
    port: options.port,
    host: options.host,
    handleSignals: options.handleSignals,
    services: [{ definition: OrderService.service, implementation }],
    onShutdown: () => usersGateway.close(),
  });
}
