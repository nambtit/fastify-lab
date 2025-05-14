import { User } from "../models/User";

export interface IUserService {
  register(email: string, password: string): Promise<User>;
}
