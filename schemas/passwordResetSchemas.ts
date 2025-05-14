import { APP_CONFIG } from "../config";

export const requestResetSchema = {
  type: "object",
  properties: {
    email: { type: "string", format: "email" },
  },
  required: ["email"],
  additionalProperties: false,
};

export const confirmResetSchema = {
  type: "object",
  properties: {
    token: { type: "string" },
    newPassword: { type: "string", minLength: APP_CONFIG.PASSWORD_MIN_LENGTH },
  },
  required: ["token", "newPassword"],
  additionalProperties: false,
};
