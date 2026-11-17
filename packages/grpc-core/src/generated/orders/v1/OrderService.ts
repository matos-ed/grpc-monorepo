// Original file: protos/orders/v1/orders.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { CreateOrderRequestInput as _orders_v1_CreateOrderRequestInput, CreateOrderRequest as _orders_v1_CreateOrderRequest } from '../../orders/v1/CreateOrderRequest';
import type { GetOrderRequestInput as _orders_v1_GetOrderRequestInput, GetOrderRequest as _orders_v1_GetOrderRequest } from '../../orders/v1/GetOrderRequest';
import type { OrderInput as _orders_v1_OrderInput, Order as _orders_v1_Order } from '../../orders/v1/Order';

export interface OrderServiceClient extends grpc.Client {
  CreateOrder(argument: _orders_v1_CreateOrderRequestInput, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_orders_v1_Order>): grpc.ClientUnaryCall;
  CreateOrder(argument: _orders_v1_CreateOrderRequestInput, metadata: grpc.Metadata, callback: grpc.requestCallback<_orders_v1_Order>): grpc.ClientUnaryCall;
  CreateOrder(argument: _orders_v1_CreateOrderRequestInput, options: grpc.CallOptions, callback: grpc.requestCallback<_orders_v1_Order>): grpc.ClientUnaryCall;
  CreateOrder(argument: _orders_v1_CreateOrderRequestInput, callback: grpc.requestCallback<_orders_v1_Order>): grpc.ClientUnaryCall;
  createOrder(argument: _orders_v1_CreateOrderRequestInput, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_orders_v1_Order>): grpc.ClientUnaryCall;
  createOrder(argument: _orders_v1_CreateOrderRequestInput, metadata: grpc.Metadata, callback: grpc.requestCallback<_orders_v1_Order>): grpc.ClientUnaryCall;
  createOrder(argument: _orders_v1_CreateOrderRequestInput, options: grpc.CallOptions, callback: grpc.requestCallback<_orders_v1_Order>): grpc.ClientUnaryCall;
  createOrder(argument: _orders_v1_CreateOrderRequestInput, callback: grpc.requestCallback<_orders_v1_Order>): grpc.ClientUnaryCall;
  
  GetOrder(argument: _orders_v1_GetOrderRequestInput, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_orders_v1_Order>): grpc.ClientUnaryCall;
  GetOrder(argument: _orders_v1_GetOrderRequestInput, metadata: grpc.Metadata, callback: grpc.requestCallback<_orders_v1_Order>): grpc.ClientUnaryCall;
  GetOrder(argument: _orders_v1_GetOrderRequestInput, options: grpc.CallOptions, callback: grpc.requestCallback<_orders_v1_Order>): grpc.ClientUnaryCall;
  GetOrder(argument: _orders_v1_GetOrderRequestInput, callback: grpc.requestCallback<_orders_v1_Order>): grpc.ClientUnaryCall;
  getOrder(argument: _orders_v1_GetOrderRequestInput, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_orders_v1_Order>): grpc.ClientUnaryCall;
  getOrder(argument: _orders_v1_GetOrderRequestInput, metadata: grpc.Metadata, callback: grpc.requestCallback<_orders_v1_Order>): grpc.ClientUnaryCall;
  getOrder(argument: _orders_v1_GetOrderRequestInput, options: grpc.CallOptions, callback: grpc.requestCallback<_orders_v1_Order>): grpc.ClientUnaryCall;
  getOrder(argument: _orders_v1_GetOrderRequestInput, callback: grpc.requestCallback<_orders_v1_Order>): grpc.ClientUnaryCall;
  
}

export interface OrderServiceHandlers extends grpc.UntypedServiceImplementation {
  CreateOrder: grpc.handleUnaryCall<_orders_v1_CreateOrderRequest, _orders_v1_OrderInput>;
  
  GetOrder: grpc.handleUnaryCall<_orders_v1_GetOrderRequest, _orders_v1_OrderInput>;
  
}

export interface OrderServiceDefinition extends grpc.ServiceDefinition {
  CreateOrder: MethodDefinition<_orders_v1_CreateOrderRequestInput, _orders_v1_OrderInput, _orders_v1_CreateOrderRequest, _orders_v1_Order>
  GetOrder: MethodDefinition<_orders_v1_GetOrderRequestInput, _orders_v1_OrderInput, _orders_v1_GetOrderRequest, _orders_v1_Order>
}
