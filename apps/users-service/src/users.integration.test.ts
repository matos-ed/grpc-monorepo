import { UserService, type User, type UserServiceClient } from '@grpc-monorepo/contracts-users';
import { callUnary, createClient, status, type IRunningServer } from '@grpc-monorepo/grpc-core';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { startUsersService } from './app';

describe('users-service', () => {
  let server: IRunningServer;
  let client: UserServiceClient;

  beforeAll(async () => {
    server = await startUsersService({ port: 0, host: '127.0.0.1', handleSignals: false });
    client = createClient(UserService, `127.0.0.1:${server.port}`);
  });

  afterAll(async () => {
    client.close();
    await server.shutdown();
  });

  const getUser = (id: string): Promise<User> =>
    callUnary<User>((options, callback) => client.getUser({ id }, options, callback));

  describe('GetUser', () => {
    it('should return a seeded user', async () => {
      await expect(getUser('u-1')).resolves.toEqual({ id: 'u-1', name: 'Ada Lovelace', email: 'ada@example.com' });
    });

    it('should fail with NOT_FOUND for an unknown id', async () => {
      await expect(getUser('nope')).rejects.toMatchObject({ code: status.NOT_FOUND });
    });

    it('should fail with INVALID_ARGUMENT for an empty id', async () => {
      await expect(getUser('')).rejects.toMatchObject({ code: status.INVALID_ARGUMENT });
    });
  });
});
