import { count, eq } from "drizzle-orm";
import {
  categories,
  products,
  subcategories,
  subcollections,
} from "~~/db/schema";

export default defineEventHandler(
  async (event) => {
    const slug = getRouterParam(event, "slug");
    if (!slug) {
      throw createError({ statusCode: 400, message: "Missing slug" });
    }
    const [category, countRows] = await Promise.all([
      db.query.categories.findFirst({
        where: { slug },
        with: {
          subcollections: {
            with: {
              subcategories: true,
            },
          },
        },
      }),
      db
        .select({ count: count() })
        .from(categories)
        .leftJoin(
          subcollections,
          eq(categories.slug, subcollections.category_slug),
        )
        .leftJoin(
          subcategories,
          eq(subcollections.id, subcategories.subcollection_id),
        )
        .leftJoin(products, eq(subcategories.slug, products.subcategory_slug))
        .where(eq(categories.slug, slug)),
    ]);
    if (!category) {
      throw createError({ statusCode: 404, message: "Category not found" });
    }
    const c = countRows[0]?.count;
    return { category, count: typeof c === "bigint" ? Number(c) : Number(c ?? 0) };
  },
);
