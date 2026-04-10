export default defineEventHandler(async (event) => {
  clearSessionCookie(event);
  deleteCookie(event, "cart", { path: "/" });
  return { ok: true };
});
