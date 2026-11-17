import type { User } from '@grpc-monorepo/grpc-core';

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
}

const SEED_USERS: readonly User[] = [
  { id: 'u-1', name: 'Ada Lovelace', email: 'ada@example.com' },
  { id: 'u-2', name: 'Alan Turing', email: 'alan@example.com' },
  { id: 'u-3', name: 'Grace Hopper', email: 'grace@example.com' },
];

export class InMemoryUserRepository implements IUserRepository {
  private readonly users: ReadonlyMap<string, User>;

  constructor(seed: readonly User[] = SEED_USERS) {
    this.users = new Map(seed.map((user) => [user.id, user]));
  }

  async findById(id: string): Promise<User | null> {
    return this.users.get(id) ?? null;
  }
}
