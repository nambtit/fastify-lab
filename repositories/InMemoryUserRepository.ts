import { IUserRepository } from "./IUserRepository";
import { User } from "../models/User";
import { Status } from "../config";

const inMemoryUsers: User[] = [];

export const InMemoryUserRepository: IUserRepository = {
  findByEmail(email: string): User | undefined {
    return inMemoryUsers.find(
      (u) => u.email === email && u.status === Status.ACTIVE,
    );
  },
  findById(userId: string): User | undefined {
    return inMemoryUsers.find(
      (u) => u.id === userId && u.status === Status.ACTIVE,
    );
  },
  create(user: User): User {
    inMemoryUsers.push(user);
    return user;
  },
  update(user: User): void {
    user.updatedAt = Date.now();
  },
};
