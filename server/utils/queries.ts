import type { H3Event } from "h3";
import { and, count, eq, like, sql } from "drizzle-orm";
import {
  categories,
  products,
  subcategories,
  subcollections,
  users,
} from "~~/db/schema";
import { useDb } from "./db";

const REVALIDATE_PRODUCTS = 60 * 60 * 2;

export async function getUser(event: H3Event) {
  const sessionData = await getUserSession(event);
  if (
    !sessionData.user ||
    typeof sessionData.user.id !== "number"
  ) {
    return null;
  }

  const db = useDb();
  const user = await db
    .select()
    .from(users)
    .where(and(eq(users.id, sessionData.user.id)))
    .limit(1);

  if (user.length === 0) {
    return null;
  }

  return user[0]!;
}

const getProductsForSubcategoryUncached = async (subcategorySlug: string) => {
  const db = useDb();
  return db.query.products.findMany({
    where: { subcategory_slug: subcategorySlug },
    orderBy: (p, { asc }) => asc(p.slug),
  });
};

export const getProductsForSubcategory = defineCachedFunction(
  getProductsForSubcategoryUncached,
  {
    name: "subcategory-products",
    maxAge: REVALIDATE_PRODUCTS,
    getKey: (subcategorySlug: string) => subcategorySlug,
  },
);

const getCollectionsUncached = async () => {
  const db = useDb();
  return db.query.collections.findMany({
    with: {
      categories: true,
    },
    orderBy: (c, { asc }) => asc(c.name),
  });
};

export const getCollections = defineCachedFunction(getCollectionsUncached, {
  name: "collections",
  maxAge: REVALIDATE_PRODUCTS,
  getKey: () => "default",
});

export async function getProductDetails(productSlug: string) {
  const db = useDb();
  return db.query.products.findFirst({
    where: { slug: productSlug },
  });
}

const getSubcategoryUncached = async (subcategorySlug: string) => {
  const db = useDb();
  return db.query.subcategories.findFirst({
    where: { slug: subcategorySlug },
  });
};

export const getSubcategory = defineCachedFunction(getSubcategoryUncached, {
  name: "subcategory",
  maxAge: REVALIDATE_PRODUCTS,
  getKey: (subcategorySlug: string) => subcategorySlug,
});

const getCategoryUncached = async (categorySlug: string) => {
  const db = useDb();
  return db.query.categories.findFirst({
    where: { slug: categorySlug },
    with: {
      subcollections: {
        with: {
          subcategories: true,
        },
      },
    },
  });
};

export const getCategory = defineCachedFunction(getCategoryUncached, {
  name: "category",
  maxAge: REVALIDATE_PRODUCTS,
  getKey: (categorySlug: string) => categorySlug,
});

const getCollectionDetailsUncached = async (collectionSlug: string) => {
  const db = useDb();
  return db.query.collections.findMany({
    with: {
      categories: true,
    },
    where: { slug: collectionSlug },
    orderBy: (c, { asc }) => asc(c.slug),
  });
};

export const getCollectionDetails = defineCachedFunction(
  getCollectionDetailsUncached,
  {
    name: "collection",
    maxAge: REVALIDATE_PRODUCTS,
    getKey: (collectionSlug: string) => collectionSlug,
  },
);

const getProductCountUncached = async () => {
  const db = useDb();
  return db.select({ count: count() }).from(products);
};

export const getProductCount = defineCachedFunction(getProductCountUncached, {
  name: "total-product-count",
  maxAge: REVALIDATE_PRODUCTS,
  getKey: () => "default",
});

const getCategoryProductCountUncached = async (categorySlug: string) => {
  const db = useDb();
  return db
    .select({ count: count() })
    .from(categories)
    .leftJoin(
      subcollections,
      eq(categories.slug, subcollections.category_slug),
    )
    .leftJoin(
      subcategories,
      eq(subcollections.id, subcategories.subcollection_id),
    )
    .leftJoin(products, eq(subcategories.slug, products.subcategory_slug))
    .where(eq(categories.slug, categorySlug));
};

export const getCategoryProductCount = defineCachedFunction(
  getCategoryProductCountUncached,
  {
    name: "category-product-count",
    maxAge: REVALIDATE_PRODUCTS,
    getKey: (categorySlug: string) => categorySlug,
  },
);

const getSubcategoryProductCountUncached = async (subcategorySlug: string) => {
  const db = useDb();
  return db
    .select({ count: count() })
    .from(products)
    .where(eq(products.subcategory_slug, subcategorySlug));
};

export const getSubcategoryProductCount = defineCachedFunction(
  getSubcategoryProductCountUncached,
  {
    name: "subcategory-product-count",
    maxAge: REVALIDATE_PRODUCTS,
    getKey: (subcategorySlug: string) => subcategorySlug,
  },
);

export async function getSearchResults(searchTerm: string) {
  const db = useDb();

  const joined = () =>
    db
      .select()
      .from(products)
      .innerJoin(
        subcategories,
        sql`${products.subcategory_slug} = ${subcategories.slug}`,
      )
      .innerJoin(
        subcollections,
        sql`${subcategories.subcollection_id} = ${subcollections.id}`,
      )
      .innerJoin(
        categories,
        sql`${subcollections.category_slug} = ${categories.slug}`,
      );

  if (searchTerm.length <= 2) {
    return joined()
      .where(like(products.name, `${searchTerm}%`))
      .limit(5);
  }

  const tokens = searchTerm
    .split(" ")
    .filter((term) => term.trim() !== "");

  return joined()
    .where(and(...tokens.map((term) => like(products.name, `%${term}%`))))
    .limit(5);
}
