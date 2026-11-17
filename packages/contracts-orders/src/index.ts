import { loadProto } from '@grpc-monorepo/grpc-core';
import type { ProtoGrpcType } from './generated/orders';

export const { OrderService } = loadProto<ProtoGrpcType>(
  new URL('../proto/orders/v1/orders.proto', import.meta.url),
).orders.v1;

export type { CreateOrderRequest, CreateOrderRequestInput } from './generated/orders/v1/CreateOrderRequest';
export type { GetOrderRequest, GetOrderRequestInput } from './generated/orders/v1/GetOrderRequest';
export type { Order, OrderInput } from './generated/orders/v1/Order';
export type { OrderServiceClient, OrderServiceHandlers } from './generated/orders/v1/OrderService';
