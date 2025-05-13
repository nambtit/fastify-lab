import { APP_CONFIG } from '../config';

export const registerSchema = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email' },
    password: { type: 'string', minLength: APP_CONFIG.PASSWORD_MIN_LENGTH }
  },
  required: ['email', 'password'],
  additionalProperties: false
};

export const passwordResetRequestSchema = {
  body: {
    type: 'object',
    properties: {
      email: { type: 'string', format: 'email' },
    },
    required: ['email'],
    additionalProperties: false,
  },
};

export const passwordResetConfirmSchema = {
  body: {
    type: 'object',
    properties: {
      token: { type: 'string' },
      newPassword: { type: 'string', minLength: 6 },
    },
    required: ['token', 'newPassword'],
    additionalProperties: false,
  },
};
