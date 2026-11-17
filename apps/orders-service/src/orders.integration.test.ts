import { OrderService, type Order, type OrderServiceClient } from '@grpc-monorepo/contracts-orders';
import { UserService, type UserServiceHandlers } from '@grpc-monorepo/contracts-users';
import {
  callUnary,
  createClient,
  notFound,
  startServer,
  status,
  unary,
  type IRunningServer,
} from '@grpc-monorepo/grpc-core';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { startOrdersService } from './app';

const fakeUserHandlers: UserServiceHandlers = {
  GetUser: unary(async ({ id }) => {
    if (id !== 'u-1') throw notFound(`user ${id} not found`);
    return { id: 'u-1', name: 'Ada Lovelace', email: 'ada@example.com' };
  }),
};

interface IHarness {
  readonly servers: readonly IRunningServer[];
  readonly client: OrderServiceClient;
}

async function startHarness(usersAddress?: string): Promise<IHarness> {
  const servers: IRunningServer[] = [];
  let address = usersAddress;
  if (!address) {
    const usersServer = await startServer({
      name: 'fake-users',
      port: 0,
      host: '127.0.0.1',
      handleSignals: false,
      services: [{ definition: UserService.service, implementation: fakeUserHandlers }],
    });
    servers.push(usersServer);
    address = `127.0.0.1:${usersServer.port}`;
  }
  const ordersServer = await startOrdersService({ port: 0, host: '127.0.0.1', usersAddress: address, handleSignals: false });
  servers.push(ordersServer);
  return { servers, client: createClient(OrderService, `127.0.0.1:${ordersServer.port}`) };
}

async function stopHarness({ servers, client }: IHarness): Promise<void> {
  client.close();
  await Promise.all(servers.map((server) => server.shutdown()));
}

describe('orders-service', () => {
  describe('with users-service up', () => {
    let harness: IHarness;

    beforeAll(async () => {
      harness = await startHarness();
    });

    afterAll(() => stopHarness(harness));

    const createOrder = (userId: string, quantity = 2): Promise<Order> =>
      callUnary<Order>((options, callback) =>
        harness.client.createOrder({ userId, item: 'pizza', quantity }, options, callback),
      );

    it('should create an order enriched with the user name and fetch it back', async () => {
      const created = await createOrder('u-1');

      expect(created).toMatchObject({ userId: 'u-1', userName: 'Ada Lovelace', item: 'pizza', quantity: 2 });

      const fetched = await callUnary<Order>((options, callback) =>
        harness.client.getOrder({ id: created.id }, options, callback),
      );
      expect(fetched).toEqual(created);
    });

    it('should propagate NOT_FOUND from users-service', async () => {
      await expect(createOrder('missing')).rejects.toMatchObject({ code: status.NOT_FOUND });
    });

    it('should reject a non-positive quantity with INVALID_ARGUMENT', async () => {
      await expect(createOrder('u-1', 0)).rejects.toMatchObject({ code: status.INVALID_ARGUMENT });
    });

    it('should return NOT_FOUND for an unknown order', async () => {
      await expect(
        callUnary<Order>((options, callback) => harness.client.getOrder({ id: 'nope' }, options, callback)),
      ).rejects.toMatchObject({ code: status.NOT_FOUND });
    });
  });

  describe('with users-service down', () => {
    let harness: IHarness;

    beforeAll(async () => {
      harness = await startHarness('127.0.0.1:1');
    });

    afterAll(() => stopHarness(harness));

    it('should fail with UNAVAILABLE', async () => {
      await expect(
        callUnary<Order>((options, callback) =>
          harness.client.createOrder({ userId: 'u-1', item: 'pizza', quantity: 1 }, options, callback),
        ),
      ).rejects.toMatchObject({ code: status.UNAVAILABLE });
    });
  });
});
