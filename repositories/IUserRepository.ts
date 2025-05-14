import { User } from "../models/User";

export interface IUserRepository {
  findByEmail(email: string): User | undefined;
  findById(userId: string): User | undefined;
  create(user: User): User;
  update(user: User): void;
}
