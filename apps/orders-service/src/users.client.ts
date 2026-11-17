import { UserService, type User, type UserServiceClient } from '@grpc-monorepo/contracts-users';
import { callUnary, createClient } from '@grpc-monorepo/grpc-core';

export interface IUsersGateway {
  getUser(id: string): Promise<User>;
  close(): void;
}

export class GrpcUsersGateway implements IUsersGateway {
  private readonly client: UserServiceClient;

  constructor(address: string) {
    this.client = createClient(UserService, address);
  }

  getUser(id: string): Promise<User> {
    return callUnary<User>((options, callback) => this.client.getUser({ id }, options, callback));
  }

  close(): void {
    this.client.close();
  }
}
