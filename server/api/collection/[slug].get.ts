export default defineEventHandler(
  async (event) => {
    const slug = getRouterParam(event, "slug");
    if (!slug) {
      throw createError({ statusCode: 400, message: "Missing slug" });
    }
    const rows = await db.query.collections.findMany({
      with: {
        categories: true,
      },
      where: { slug },
      orderBy: (c, { asc }) => asc(c.slug),
    });
    if (!rows.length) {
      throw createError({ statusCode: 404, message: "Collection not found" });
    }
    return rows;
  },
);
