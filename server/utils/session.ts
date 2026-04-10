import type { H3Event } from "h3";
import { compare, hash } from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import type { NewUser } from "~~/db/schema";

const SALT_ROUNDS = 10;

function getKey() {
  const secret = useRuntimeConfig().authSecret as string;
  if (!secret || secret.length < 32) {
    throw new Error(
      "AUTH_SECRET / NUXT_AUTH_SECRET must be at least 32 characters (set in .env or nuxt.config defaults).",
    );
  }
  return new TextEncoder().encode(secret);
}

export async function hashPassword(password: string) {
  return hash(password, SALT_ROUNDS);
}

export async function comparePasswords(
  plainTextPassword: string,
  hashedPassword: string,
) {
  return compare(plainTextPassword, hashedPassword);
}

export type SessionData = {
  user: { id: number };
  expires: string;
};

export async function signToken(payload: SessionData) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1 day from now")
    .sign(getKey());
}

export async function verifyToken(input: string) {
  const { payload } = await jwtVerify(input, getKey(), {
    algorithms: ["HS256"],
  });
  return payload as SessionData;
}

export async function setSession(event: H3Event, user: NewUser) {
  const expiresInOneDay = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const session: SessionData = {
    user: { id: user.id! },
    expires: expiresInOneDay.toISOString(),
  };
  const encryptedSession = await signToken(session);
  const isProd = process.env.NODE_ENV === "production";
  setCookie(event, "session", encryptedSession, {
    expires: expiresInOneDay,
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
  });
}

export function clearSessionCookie(event: H3Event) {
  deleteCookie(event, "session", { path: "/" });
}
