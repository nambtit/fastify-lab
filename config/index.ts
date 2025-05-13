import dotenv from 'dotenv';
dotenv.config();

export enum Status {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export const APP_CONFIG = {
  PORT: parseInt(process.env.PORT || "3000", 10),
  JWT_SECRET: process.env.JWT_SECRET || "dummy_secret", 
  JWT_ISSUER: process.env.JWT_ISSUER || "auth-service",
  SERVICE_NAME: process.env.SERVICE_NAME || "auth-service",
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
  SERVICE_ENV: process.env.SERVICE_ENV || "development",

  PASSWORD_MIN_LENGTH: 6,
  BCRYPT_SALT_ROUNDS: 10,
  ACCESS_TOKEN_EXPIRATION_MS: parseInt(process.env.ACCESS_TOKEN_EXPIRATION_MS || (15 * 60 * 1000).toString(), 10), // 15 minutes
  REFRESH_TOKEN_EXPIRATION_MS: parseInt(process.env.REFRESH_TOKEN_EXPIRATION_MS || (7 * 24 * 60 * 60 * 1000).toString(), 10), // 7 days
  PASSWORD_RESET_TOKEN_EXPIRATION_MS: parseInt(process.env.PASSWORD_RESET_TOKEN_EXPIRATION_MS || (60 * 60 * 1000).toString(), 10), // 1 hour
};
