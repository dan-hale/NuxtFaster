export default defineCachedEventHandler(
  async (event) => {
    const slug = getRouterParam(event, "slug");
    if (!slug) {
      throw createError({ statusCode: 400, message: "Missing slug" });
    }
    const [category, countRows] = await Promise.all([
      getCategory(slug),
      getCategoryProductCount(slug),
    ]);
    if (!category) {
      throw createError({ statusCode: 404, message: "Category not found" });
    }
    const c = countRows[0]?.count;
    const count = typeof c === "bigint" ? Number(c) : Number(c ?? 0);
    return { category, count };
  },
  { maxAge: 60, swr: true, name: "api-category" },
);
