import { sql } from "drizzle-orm";
import {
  index,
  integer,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const collections = pgTable("collections", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
});

export type Collection = typeof collections.$inferSelect;

export const categories = pgTable(
  "categories",
  {
    slug: text("slug").notNull().primaryKey(),
    name: text("name").notNull(),
    collection_id: integer("collection_id")
      .notNull()
      .references(() => collections.id, { onDelete: "cascade" }),
    image_url: text("image_url"),
  },
  (table) => ({
    collectionIdIdx: index("categories_collection_id_idx").on(
      table.collection_id,
    ),
  }),
);

export type Category = typeof categories.$inferSelect;

export const subcollections = pgTable(
  "subcollections",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    category_slug: text("category_slug")
      .notNull()
      .references(() => categories.slug, { onDelete: "cascade" }),
  },
  (table) => ({
    categorySlugIdx: index("subcollections_category_slug_idx").on(
      table.category_slug,
    ),
  }),
);

export type Subcollection = typeof subcollections.$inferSelect;

export const subcategories = pgTable(
  "subcategories",
  {
    slug: text("slug").notNull().primaryKey(),
    name: text("name").notNull(),
    subcollection_id: integer("subcollection_id")
      .notNull()
      .references(() => subcollections.id, { onDelete: "cascade" }),
    image_url: text("image_url"),
  },
  (table) => ({
    subcollectionIdIdx: index("subcategories_subcollection_id_idx").on(
      table.subcollection_id,
    ),
  }),
);

export type Subcategory = typeof subcategories.$inferSelect;

export const products = pgTable(
  "products",
  {
    slug: text("slug").notNull().primaryKey(),
    name: text("name").notNull(),
    description: text("description").notNull(),
    price: numeric("price").notNull(),
    subcategory_slug: text("subcategory_slug")
      .notNull()
      .references(() => subcategories.slug, { onDelete: "cascade" }),
    image_url: text("image_url"),
  },
  (table) => ({
    nameSearchIndex: index("name_search_index").using(
      "gin",
      sql`to_tsvector('english', ${table.name})`,
    ),
    nameTrgmIndex: index("name_trgm_index")
      .using("gin", sql`${table.name} gin_trgm_ops`)
      .concurrently(),
    subcategorySlugIdx: index("products_subcategory_slug_idx").on(
      table.subcategory_slug,
    ),
  }),
);

export type Product = typeof products.$inferSelect;

export const collectionsRelations = relations(collections, ({ many }) => ({
  categories: many(categories),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  collection: one(collections, {
    fields: [categories.collection_id],
    references: [collections.id],
  }),
  subcollections: many(subcollections),
}));

export const subcollectionRelations = relations(
  subcollections,
  ({ one, many }) => ({
    category: one(categories, {
      fields: [subcollections.category_slug],
      references: [categories.slug],
    }),
    subcategories: many(subcategories),
  }),
);

export const subcategoriesRelations = relations(
  subcategories,
  ({ one, many }) => ({
    subcollection: one(subcollections, {
      fields: [subcategories.subcollection_id],
      references: [subcollections.id],
    }),
    products: many(products),
  }),
);

export const productsRelations = relations(products, ({ one }) => ({
  subcategory: one(subcategories, {
    fields: [products.subcategory_slug],
    references: [subcategories.slug],
  }),
}));

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 100 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
