import { OrderService, type Order } from '@grpc-monorepo/contracts-orders';
import { callUnary, createClient, isServiceError, logger, readString, status } from '@grpc-monorepo/grpc-core';

const address = readString('ORDERS_GRPC_ADDR', 'localhost:50052');
const userId = process.argv.slice(2).find((arg) => arg !== '--') ?? 'u-1';
const client = createClient(OrderService, address);

try {
  const created = await callUnary<Order>((options, callback) =>
    client.createOrder({ userId, item: 'pizza margherita', quantity: 2 }, options, callback),
  );
  logger.info({ order: created }, 'order created');

  const fetched = await callUnary<Order>((options, callback) =>
    client.getOrder({ id: created.id }, options, callback),
  );
  logger.info({ order: fetched }, 'order fetched');
} catch (error) {
  if (isServiceError(error)) {
    logger.error({ code: status[error.code], details: error.details }, 'demo call failed');
  } else {
    logger.error({ err: error }, 'demo crashed');
  }
  process.exitCode = 1;
} finally {
  client.close();
}
