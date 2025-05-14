export interface IAuthService {
  login(
    email: string,
    password: string,
  ): Promise<{ accessToken: string; refreshToken: string }>;
  logout(accessToken: string, refreshToken: string): Promise<void>;
  refresh(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }>;
}
