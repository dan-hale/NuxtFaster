export default defineCachedEventHandler(
  async (event) => {
    const slug = getRouterParam(event, "slug");
    if (!slug) {
      throw createError({ statusCode: 400, message: "Missing slug" });
    }
    const product = await getProductDetails(slug);
    if (!product) {
      throw createError({ statusCode: 404, message: "Product not found" });
    }
    return product;
  },
  { maxAge: 60, swr: true, name: "api-product" },
);
