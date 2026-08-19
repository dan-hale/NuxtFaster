import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
  collections: {
    categories: r.many.categories(),
  },
  categories: {
    collection: r.one.collections({
      from: r.categories.collection_id,
      to: r.collections.id,
      optional: false,
    }),
    subcollections: r.many.subcollections(),
  },
  subcollections: {
    category: r.one.categories({
      from: r.subcollections.category_slug,
      to: r.categories.slug,
      optional: false,
    }),
    subcategories: r.many.subcategories(),
  },
  subcategories: {
    subcollection: r.one.subcollections({
      from: r.subcategories.subcollection_id,
      to: r.subcollections.id,
      optional: false,
    }),
    products: r.many.products(),
  },
  products: {
    subcategory: r.one.subcategories({
      from: r.products.subcategory_slug,
      to: r.subcategories.slug,
      optional: false,
    }),
  },
}));
