export default defineEventHandler((event) => {
  const cart = getCart(event);
  const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);
  return { totalQuantity };
});
