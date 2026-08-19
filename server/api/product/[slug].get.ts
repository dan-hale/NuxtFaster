export default defineEventHandler(
  async (event) => {
    const slug = getRouterParam(event, "slug");
    if (!slug) {
      throw createError({ statusCode: 400, message: "Missing slug" });
    }
    const product = await db.query.products.findFirst({
      where: { slug },
    });
    if (!product) {
      throw createError({ statusCode: 404, message: "Product not found" });
    }
    return product;
  },
);
