import { count } from "drizzle-orm";
import { products } from "~~/db/schema";

export default defineEventHandler(
  async () => {
    const rows = await db.select({ count: count() }).from(products);
    const n = rows[0]?.count;
    return typeof n === "bigint" ? Number(n) : Number(n ?? 0);
  },
);
