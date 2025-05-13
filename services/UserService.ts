import { IUserService } from './IUserService';
import { IUserRepository } from '../repositories/IUserRepository';
import { APP_CONFIG, Status } from '../config';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { User } from '../models/User';

export class UserService implements IUserService {
  constructor(private userRepository: IUserRepository) {}

  async register(email: string, password: string): Promise<User> {
    if (this.userRepository.findByEmail(email)) {
      throw new Error('User already exists');
    }
    const now = Date.now();
    const salt = await bcrypt.genSalt(APP_CONFIG.BCRYPT_SALT_ROUNDS);
    const passwordHash = await bcrypt.hash(password, salt);
    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      passwordHash,
      salt,
      status: Status.ACTIVE,
      createdAt: now,
      updatedAt: now,
    };
    return this.userRepository.create(newUser);
  }
}
