export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug");
  if (!slug) {
    throw createError({ statusCode: 400, message: "Missing slug" });
  }
  const decoded = decodeURIComponent(slug);
  const rows = await getCollectionDetails(decoded);
  if (!rows.length) {
    throw createError({ statusCode: 404, message: "Collection not found" });
  }
  return rows;
});
