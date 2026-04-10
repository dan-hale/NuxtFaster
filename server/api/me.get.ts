export default defineEventHandler(async (event) => {
  const user = await getUser(event);
  if (!user) {
    return null;
  }
  return { id: user.id, username: user.username };
});
