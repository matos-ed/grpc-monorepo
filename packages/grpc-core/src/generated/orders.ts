import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { CreateOrderRequestInput as _orders_v1_CreateOrderRequestInput, CreateOrderRequest as _orders_v1_CreateOrderRequest } from './orders/v1/CreateOrderRequest';
import type { GetOrderRequestInput as _orders_v1_GetOrderRequestInput, GetOrderRequest as _orders_v1_GetOrderRequest } from './orders/v1/GetOrderRequest';
import type { OrderInput as _orders_v1_OrderInput, Order as _orders_v1_Order } from './orders/v1/Order';
import type { OrderServiceClient as _orders_v1_OrderServiceClient, OrderServiceDefinition as _orders_v1_OrderServiceDefinition } from './orders/v1/OrderService';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  orders: {
    v1: {
      CreateOrderRequest: MessageTypeDefinition<_orders_v1_CreateOrderRequestInput, _orders_v1_CreateOrderRequest>
      GetOrderRequest: MessageTypeDefinition<_orders_v1_GetOrderRequestInput, _orders_v1_GetOrderRequest>
      Order: MessageTypeDefinition<_orders_v1_OrderInput, _orders_v1_Order>
      OrderService: SubtypeConstructor<typeof grpc.Client, _orders_v1_OrderServiceClient> & { service: _orders_v1_OrderServiceDefinition }
    }
  }
}

