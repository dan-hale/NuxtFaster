export default defineEventHandler(async (event) => {
  const headersObj = Object.fromEntries(getRequestHeaders(event));
  const stringifyHeaders = JSON.stringify(headersObj, null, 2);
  const cookies = parseCookies(event);
  const stringifyCookies = JSON.stringify(cookies, null, 2);

  return {
    headers: stringifyHeaders,
    cookies: stringifyCookies,
  };
});
