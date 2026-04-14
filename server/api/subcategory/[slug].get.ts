export default defineCachedEventHandler(
  async (event) => {
    const slug = getRouterParam(event, "slug");
    if (!slug) {
      throw createError({ statusCode: 400, message: "Missing slug" });
    }
    const [subcategory, products, countRows] = await Promise.all([
      getSubcategory(slug),
      getProductsForSubcategory(slug),
      getSubcategoryProductCount(slug),
    ]);
    if (!subcategory) {
      throw createError({ statusCode: 404, message: "Subcategory not found" });
    }
    const c = countRows[0]?.count;
    const count = typeof c === "bigint" ? Number(c) : Number(c ?? 0);
    return { subcategory, products, count };
  },
  { maxAge: 60, swr: true, name: "api-subcategory" },
);
