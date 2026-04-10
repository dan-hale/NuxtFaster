export default defineEventHandler(async (event) => {
  const body = await readBody<{ productSlug?: string }>(event);
  const productSlug = body.productSlug;
  if (typeof productSlug !== "string") {
    throw createError({ statusCode: 400, message: "Missing productSlug" });
  }

  const prevCart = getCart(event);
  const itemAlreadyExists = prevCart.find(
    (item) => item.productSlug === productSlug,
  );
  let newCart;
  if (itemAlreadyExists) {
    const newQuantity = itemAlreadyExists.quantity + 1;
    newCart = prevCart.map((item) =>
      item.productSlug === productSlug
        ? { ...item, quantity: newQuantity }
        : item,
    );
  } else {
    newCart = [...prevCart, { productSlug, quantity: 1 }];
  }
  updateCart(event, newCart);
  return { message: "Item added to cart" };
});
