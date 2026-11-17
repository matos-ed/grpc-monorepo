export { status, Metadata, type ServiceError } from '@grpc/grpc-js';

export { callUnary, createClient, type ICallOptions } from './client';
export { orders, users } from './contracts';
export { readPort, readString } from './env';
export { GrpcError, invalidArgument, isServiceError, notFound } from './errors';
export { logger } from './logger';
export { loadProto, PROTO_DIR } from './proto';
export { startServer, type IRunningServer, type IServerOptions, type IServiceRegistration } from './server';
export { unary, type UnaryHandler } from './unary';

export type { CreateOrderRequest } from './generated/orders/v1/CreateOrderRequest';
export type { GetOrderRequest } from './generated/orders/v1/GetOrderRequest';
export type { Order, OrderInput } from './generated/orders/v1/Order';
export type { OrderServiceClient, OrderServiceHandlers } from './generated/orders/v1/OrderService';
export type { GetUserRequest } from './generated/users/v1/GetUserRequest';
export type { User, UserInput } from './generated/users/v1/User';
export type { UserServiceClient, UserServiceHandlers } from './generated/users/v1/UserService';
