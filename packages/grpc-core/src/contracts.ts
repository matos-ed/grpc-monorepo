import type { ProtoGrpcType as OrdersProto } from './generated/orders';
import type { ProtoGrpcType as UsersProto } from './generated/users';
import { loadProto } from './proto';

export const users = loadProto<UsersProto>('users/v1/users.proto').users.v1;
export const orders = loadProto<OrdersProto>('orders/v1/orders.proto').orders.v1;
