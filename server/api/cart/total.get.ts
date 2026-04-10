export default defineEventHandler(async (event) => {
  const items = await detailedCart(event);
  const total = items.reduce(
    (acc, item) => acc + item.quantity * Number(item.price),
    0,
  );
  return { total: total.toFixed(2) };
});
