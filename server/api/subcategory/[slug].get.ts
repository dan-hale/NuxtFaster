export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug");
  if (!slug) {
    throw createError({ statusCode: 400, message: "Missing slug" });
  }
  const decoded = decodeURIComponent(slug);
  const [subcategory, products, countRows] = await Promise.all([
    getSubcategory(decoded),
    getProductsForSubcategory(decoded),
    getSubcategoryProductCount(decoded),
  ]);
  if (!subcategory) {
    throw createError({ statusCode: 404, message: "Subcategory not found" });
  }
  const c = countRows[0]?.count;
  const count = typeof c === "bigint" ? Number(c) : Number(c ?? 0);
  return { subcategory, products, count };
});
