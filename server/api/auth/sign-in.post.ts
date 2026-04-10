import { eq } from "drizzle-orm";
import { z } from "zod";
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
  const rl = getAuthRateLimit();
  if (rl) {
    const res = await rl.limit(ip);
    if (!res.success) {
      return {
        error: {
          code: "AUTH_ERROR",
          message: "Too many attempts. Try again later",
        },
      };
    }
  }

  const db = useDb();
  const user = await db
    .select({ user: users })
    .from(users)
    .where(eq(users.username, username))
    .limit(1);

  if (user.length === 0) {
    return { error: "Invalid username or password. Please try again." };
  }

  const { user: foundUser } = user[0]!;
  const ok = await comparePasswords(password, foundUser.passwordHash);
  if (!ok) {
    return { error: "Invalid username or password. Please try again." };
  }

  await setSession(event, foundUser);
  return { ok: true };
});
