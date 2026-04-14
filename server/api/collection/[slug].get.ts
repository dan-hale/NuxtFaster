export default defineCachedEventHandler(
  async (event) => {
    const slug = getRouterParam(event, "slug");
    if (!slug) {
      throw createError({ statusCode: 400, message: "Missing slug" });
    }
    const rows = await getCollectionDetails(slug);
    if (!rows.length) {
      throw createError({ statusCode: 404, message: "Collection not found" });
    }
    return rows;
  },
  { maxAge: 60, swr: true, name: "api-collection" },
);
