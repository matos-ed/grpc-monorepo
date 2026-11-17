import { loadProto } from '@grpc-monorepo/grpc-core';
import type { ProtoGrpcType } from './generated/users';

export const { UserService } = loadProto<ProtoGrpcType>(
  new URL('../proto/users/v1/users.proto', import.meta.url),
).users.v1;

export type { GetUserRequest, GetUserRequestInput } from './generated/users/v1/GetUserRequest';
export type { User, UserInput } from './generated/users/v1/User';
export type { UserServiceClient, UserServiceHandlers } from './generated/users/v1/UserService';
