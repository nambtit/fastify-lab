import { APP_CONFIG } from "../config";

export const loginSchema = {
  type: "object",
  properties: {
    email: { type: "string", format: "email" },
    password: { type: "string", minLength: APP_CONFIG.PASSWORD_MIN_LENGTH },
  },
  required: ["email", "password"],
  additionalProperties: false,
};

export const logoutSchema = {
  type: "object",
  properties: {
    refreshToken: { type: "string" },
  },
  required: ["refreshToken"],
  additionalProperties: false,
};

export const refreshSchema = {
  type: "object",
  properties: {
    refreshToken: { type: "string" },
  },
  required: ["refreshToken"],
  additionalProperties: false,
};
