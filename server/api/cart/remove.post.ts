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
  if (!itemAlreadyExists) {
    return { ok: true };
  }
  const newCart = prevCart.filter((item) => item.productSlug !== productSlug);
  updateCart(event, newCart);
  return { ok: true };
});
