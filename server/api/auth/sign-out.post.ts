export default defineEventHandler(async (event) => {
  await clearUserSession(event);
  deleteCookie(event, "cart", { path: "/" });
  return { ok: true };
});
