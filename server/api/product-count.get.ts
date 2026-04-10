export default defineEventHandler(async () => {
  const rows = await getProductCount();
  const n = rows[0]?.count;
  return typeof n === "bigint" ? Number(n) : Number(n ?? 0);
});
