import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

let authRateLimit: Ratelimit | null = null;
let signUpRateLimit: Ratelimit | null = null;

function getRedis() {
  const config = useRuntimeConfig();
  const url = config.kvRestApiUrl as string | undefined;
  const token = config.kvRestApiToken as string | undefined;
  if (!url || !token) {
    return null;
  }
  return new Redis({ url, token });
}

export function getAuthRateLimit() {
  if (authRateLimit) return authRateLimit;
  const redis = getRedis();
  if (!redis) return null;
  authRateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "15 m"),
    analytics: true,
    prefix: "ratelimit:auth",
  });
  return authRateLimit;
}

export function getSignUpRateLimit() {
  if (signUpRateLimit) return signUpRateLimit;
  const redis = getRedis();
  if (!redis) return null;
  signUpRateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(1, "15 m"),
    analytics: true,
    prefix: "ratelimit:signup",
  });
  return signUpRateLimit;
}
