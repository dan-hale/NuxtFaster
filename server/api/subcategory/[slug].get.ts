import { count, eq } from "drizzle-orm";
import { products as productsTable } from "~~/db/schema";

export default defineEventHandler(
  async (event) => {
    const slug = getRouterParam(event, "slug");
    if (!slug) {
      throw createError({ statusCode: 400, message: "Missing slug" });
    }
    const [subcategory, products, countRows] = await Promise.all([
      db.query.subcategories.findFirst({
        where: { slug },
      }),
      db.query.products.findMany({
        where: { subcategory_slug: slug },
        orderBy: (p, { asc }) => asc(p.slug),
      }),
      db
        .select({ count: count() })
        .from(productsTable)
        .where(eq(productsTable.subcategory_slug, slug)),
    ]);
    if (!subcategory) {
      throw createError({ statusCode: 404, message: "Subcategory not found" });
    }
    const c = countRows[0]?.count;
    return { subcategory, products, count: typeof c === "bigint" ? Number(c) : Number(c ?? 0) };
  },
);
