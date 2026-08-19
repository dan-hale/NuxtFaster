export default defineEventHandler(
  async () => db.query.collections.findMany({
    with: {
      categories: true,
    },
    orderBy: (c, { asc }) => asc(c.name),
  }),
);
