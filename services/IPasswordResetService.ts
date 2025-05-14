export interface IPasswordResetService {
  requestReset(email: string): Promise<void>;
  confirmReset(token: string, newPassword: string): Promise<void>;
}
