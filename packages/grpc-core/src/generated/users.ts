import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { GetUserRequestInput as _users_v1_GetUserRequestInput, GetUserRequest as _users_v1_GetUserRequest } from './users/v1/GetUserRequest';
import type { UserInput as _users_v1_UserInput, User as _users_v1_User } from './users/v1/User';
import type { UserServiceClient as _users_v1_UserServiceClient, UserServiceDefinition as _users_v1_UserServiceDefinition } from './users/v1/UserService';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  users: {
    v1: {
      GetUserRequest: MessageTypeDefinition<_users_v1_GetUserRequestInput, _users_v1_GetUserRequest>
      User: MessageTypeDefinition<_users_v1_UserInput, _users_v1_User>
      UserService: SubtypeConstructor<typeof grpc.Client, _users_v1_UserServiceClient> & { service: _users_v1_UserServiceDefinition }
    }
  }
}

