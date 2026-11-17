import type { UserServiceHandlers } from '@grpc-monorepo/contracts-users';
import { invalidArgument, notFound, unary } from '@grpc-monorepo/grpc-core';
import type { IUserRepository } from './users.repository';

export function createUserHandlers(repository: IUserRepository): UserServiceHandlers {
  return {
    GetUser: unary(async ({ id }) => {
      if (!id) throw invalidArgument('id is required');
      const user = await repository.findById(id);
      if (!user) throw notFound(`user ${id} not found`);
      return user;
    }),
  };
}
