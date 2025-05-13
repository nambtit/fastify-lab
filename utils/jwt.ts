import { SignJWT, jwtVerify, decodeProtectedHeader, decodeJwt } from "jose";
import { APP_CONFIG } from "../config";
import crypto from "crypto";

export async function generateAccessToken(
  email: string,
): Promise<{ token: string; jti: string; issuedAt: number }> {
  const nowMs = Date.now();
  const nowSec = Math.floor(nowMs / 1000);
  const expSec =
    nowSec + Math.floor(APP_CONFIG.ACCESS_TOKEN_EXPIRATION_MS / 1000);
  const nbfSec = nowSec;
  const jti = crypto.randomUUID();
  const encoder = new TextEncoder();

  const token = await new SignJWT({ sub: email, jti })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuer(APP_CONFIG.JWT_ISSUER)
    .setIssuedAt(nowSec)
    .setExpirationTime(expSec)
    .setNotBefore(nbfSec)
    .sign(encoder.encode(APP_CONFIG.JWT_SECRET));

  return { token, jti, issuedAt: nowMs };
}

export async function generateRefreshToken(
  email: string,
): Promise<{ token: string; issuedAt: number }> {
  const nowMs = Date.now();
  const nowSec = Math.floor(nowMs / 1000);
  const expSec =
    nowSec + Math.floor(APP_CONFIG.REFRESH_TOKEN_EXPIRATION_MS / 1000);
  const jti = crypto.randomUUID();
  const encoder = new TextEncoder();

  const token = await new SignJWT({ sub: email, jti })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuer(APP_CONFIG.JWT_ISSUER)
    .setIssuedAt(nowSec)
    .setExpirationTime(expSec)
    .sign(encoder.encode(APP_CONFIG.JWT_SECRET));

  return { token, issuedAt: nowMs };
}

export async function verifyJWT(token: string): Promise<any> {
  const encoder = new TextEncoder();
  return jwtVerify(token, encoder.encode(APP_CONFIG.JWT_SECRET), {
    issuer: APP_CONFIG.JWT_ISSUER,
  });
}

export { decodeProtectedHeader, decodeJwt };
