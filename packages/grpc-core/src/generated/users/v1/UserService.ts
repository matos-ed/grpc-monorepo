// Original file: protos/users/v1/users.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { GetUserRequestInput as _users_v1_GetUserRequestInput, GetUserRequest as _users_v1_GetUserRequest } from '../../users/v1/GetUserRequest';
import type { UserInput as _users_v1_UserInput, User as _users_v1_User } from '../../users/v1/User';

export interface UserServiceClient extends grpc.Client {
  GetUser(argument: _users_v1_GetUserRequestInput, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_users_v1_User>): grpc.ClientUnaryCall;
  GetUser(argument: _users_v1_GetUserRequestInput, metadata: grpc.Metadata, callback: grpc.requestCallback<_users_v1_User>): grpc.ClientUnaryCall;
  GetUser(argument: _users_v1_GetUserRequestInput, options: grpc.CallOptions, callback: grpc.requestCallback<_users_v1_User>): grpc.ClientUnaryCall;
  GetUser(argument: _users_v1_GetUserRequestInput, callback: grpc.requestCallback<_users_v1_User>): grpc.ClientUnaryCall;
  getUser(argument: _users_v1_GetUserRequestInput, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_users_v1_User>): grpc.ClientUnaryCall;
  getUser(argument: _users_v1_GetUserRequestInput, metadata: grpc.Metadata, callback: grpc.requestCallback<_users_v1_User>): grpc.ClientUnaryCall;
  getUser(argument: _users_v1_GetUserRequestInput, options: grpc.CallOptions, callback: grpc.requestCallback<_users_v1_User>): grpc.ClientUnaryCall;
  getUser(argument: _users_v1_GetUserRequestInput, callback: grpc.requestCallback<_users_v1_User>): grpc.ClientUnaryCall;
  
}

export interface UserServiceHandlers extends grpc.UntypedServiceImplementation {
  GetUser: grpc.handleUnaryCall<_users_v1_GetUserRequest, _users_v1_UserInput>;
  
}

export interface UserServiceDefinition extends grpc.ServiceDefinition {
  GetUser: MethodDefinition<_users_v1_GetUserRequestInput, _users_v1_UserInput, _users_v1_GetUserRequest, _users_v1_User>
}
