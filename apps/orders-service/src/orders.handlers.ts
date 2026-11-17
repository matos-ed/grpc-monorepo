import { invalidArgument, notFound, unary, type Order, type OrderServiceHandlers } from '@grpc-monorepo/grpc-core';
import { randomUUID } from 'node:crypto';
import type { IOrderRepository } from './orders.repository';
import type { IUsersGateway } from './users.client';

export interface IOrderHandlerDeps {
  readonly users: IUsersGateway;
  readonly orders: IOrderRepository;
}

export function createOrderHandlers({ users, orders }: IOrderHandlerDeps): OrderServiceHandlers {
  return {
    CreateOrder: unary(async ({ userId, item, quantity }) => {
      if (!userId) throw invalidArgument('user_id is required');
      if (!item) throw invalidArgument('item is required');
      if (quantity <= 0) throw invalidArgument('quantity must be greater than zero');

      const user = await users.getUser(userId);
      const order: Order = {
        id: randomUUID(),
        userId: user.id,
        userName: user.name,
        item,
        quantity,
        createdAt: new Date().toISOString(),
      };
      await orders.save(order);
      return order;
    }),

    GetOrder: unary(async ({ id }) => {
      if (!id) throw invalidArgument('id is required');
      const order = await orders.findById(id);
      if (!order) throw notFound(`order ${id} not found`);
      return order;
    }),
  };
}
