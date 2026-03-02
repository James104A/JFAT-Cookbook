import { cookies } from "next/headers";
import { createHmac } from "crypto";

export const AUTH_COOKIE = "auth-token";
export const AUTH_STATUS_COOKIE = "auth-status";
const TOKEN_SECRET = "go-to-recipes-auth";
const EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export function createToken(password: string): { token: string; expires: Date } {
  const expires = new Date(Date.now() + EXPIRY_MS);
  const payload = `${password}:${expires.getTime()}`;
  const signature = createHmac("sha256", TOKEN_SECRET)
    .update(payload)
    .digest("hex");
  const token = `${expires.getTime()}.${signature}`;
  return { token, expires };
}

export function verifyToken(token: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword || !token) return false;

  const [timestampStr, signature] = token.split(".");
  if (!timestampStr || !signature) return false;

  const timestamp = parseInt(timestampStr, 10);
  if (isNaN(timestamp) || Date.now() > timestamp) return false;

  const payload = `${adminPassword}:${timestamp}`;
  const expected = createHmac("sha256", TOKEN_SECRET)
    .update(payload)
    .digest("hex");

  return signature === expected;
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;
  if (!token) return false;
  return verifyToken(token);
}
