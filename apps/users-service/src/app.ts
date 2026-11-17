import { UserService } from '@grpc-monorepo/contracts-users';
import { startServer, type IRunningServer } from '@grpc-monorepo/grpc-core';
import { createUserHandlers } from './users.handlers';
import { InMemoryUserRepository, type IUserRepository } from './users.repository';

export interface IUsersServiceOptions {
  readonly port: number;
  readonly host?: string;
  readonly handleSignals?: boolean;
  readonly repository?: IUserRepository;
}

export function startUsersService(options: IUsersServiceOptions): Promise<IRunningServer> {
  const repository = options.repository ?? new InMemoryUserRepository();
  return startServer({
    name: 'users-service',
    port: options.port,
    host: options.host,
    handleSignals: options.handleSignals,
    services: [{ definition: UserService.service, implementation: createUserHandlers(repository) }],
  });
}
