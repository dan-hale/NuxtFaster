import { and, eq } from "drizzle-orm";
import { users } from "~~/db/schema";

export default defineEventHandler(async (event) => {
  const sessionData = await getUserSession(event);
  if (
    !sessionData.user ||
    typeof sessionData.user.id !== "number"
  ) {
    return null;
  }

  const user = await db
    .select()
    .from(users)
    .where(and(eq(users.id, sessionData.user.id)))
    .limit(1);

  if (user.length === 0) {
    return null;
  }

  return { id: user[0]!.id, username: user[0]!.username };
});
