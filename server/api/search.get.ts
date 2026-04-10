import { z } from "zod";

const searchQuerySchema = z.object({
  q: z.string().max(500).optional().default(""),
});

export default defineEventHandler(async (event) => {
  const { q: rawQ } = await getValidatedQuery(event, (query: unknown) =>
    searchQuerySchema.parse({
      q:
        typeof query === "object" &&
        query !== null &&
        "q" in query &&
        typeof (query as { q: unknown }).q === "string"
          ? (query as { q: string }).q
          : "",
    }),
  );
  const searchTerm = rawQ;
  if (!searchTerm.length) {
    return [];
  }

  const results = await getSearchResults(searchTerm);

  const searchResults = results.map((raw) => {
    const row = raw as Record<string, unknown>;
    const products = row.products as
      | {
          slug: string;
          name: string;
          description: string;
          price: string;
          image_url: string | null;
          subcategory_slug: string;
        }
      | undefined;
    const subcategories = row.subcategories as { slug: string } | undefined;
    const categories = row.categories as { slug: string } | undefined;

    if (products && subcategories && categories) {
      const href = `/products/${categories.slug}/${subcategories.slug}/${products.slug}`;
      return {
        ...products,
        href,
      };
    }

    const merged = raw as {
      slug?: string;
      name?: string;
      description?: string;
      price?: string;
      image_url?: string | null;
      subcategory_slug?: string;
      categories?: { slug: string };
      subcategories?: { slug: string };
    };
    if (
      merged.slug &&
      merged.subcategories?.slug &&
      merged.categories?.slug
    ) {
      const href = `/products/${merged.categories.slug}/${merged.subcategories.slug}/${merged.slug}`;
      return {
        slug: merged.slug,
        name: merged.name ?? "",
        description: merged.description ?? "",
        price: merged.price ?? "0",
        image_url: merged.image_url ?? null,
        subcategory_slug: merged.subcategory_slug ?? "",
        href,
      };
    }

    return null;
  }).filter((x): x is NonNullable<typeof x> => x !== null);

  return searchResults;
});
