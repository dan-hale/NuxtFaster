import { eq } from "drizzle-orm";
import { z } from "zod";
import type { NewUser } from "~~/db/schema";
import { users } from "~~/db/schema";

const authSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export default defineEventHandler(async (event) => {
  const { username, password } = await readValidatedBody(event, (body) =>
    authSchema.parse(body),
  );

  const ip = getRequestHeader(event, "x-real-ip") ?? "local";
  const rl = getSignUpRateLimit();
  if (rl) {
    const res = await rl.limit(ip);
    if (!res.success) {
      return {
        error: {
          code: "AUTH_ERROR",
          message: "Too many signups. Try again later",
        },
      };
    }
  }

  const db = useDb();
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1);

  if (existingUser.length > 0) {
    return { error: "Username already taken. Please try again." };
  }

  const passwordHash = await hashPassword(password);
  const newUser: NewUser = { username, passwordHash };
  const [createdUser] = await db.insert(users).values(newUser).returning();

  if (!createdUser) {
    return { error: "Failed to create user. Please try again." };
  }

  await setSession(event, createdUser);
  return { ok: true };
});
