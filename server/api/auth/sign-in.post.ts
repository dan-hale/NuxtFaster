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
  const ok = await verifyPassword(foundUser.passwordHash, password);
  if (!ok) {
    return { error: "Invalid username or password. Please try again." };
  }

  await setUserSession(event, {
    user: { id: foundUser.id, username: foundUser.username },
    loggedInAt: new Date(),
  });
  return { ok: true };
});
