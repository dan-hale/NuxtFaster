import {
  index,
  integer,
  numeric,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

export const collections = sqliteTable("collections", {
  id: integer().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  slug: text().notNull(),
});

export type Collection = typeof collections.$inferSelect;

export const categories = sqliteTable(
  "categories",
  {
    slug: text().notNull().primaryKey(),
    name: text().notNull(),
    collection_id: integer()
      .notNull()
      .references(() => collections.id, { onDelete: "cascade" }),
    image_url: text(),
  },
  (table) => [
    index("categories_collection_id_idx").on(table.collection_id),
  ],
);

export type Category = typeof categories.$inferSelect;

export const subcollections = sqliteTable(
  "subcollections",
  {
    id: integer().primaryKey({ autoIncrement: true }),
    name: text().notNull(),
    category_slug: text()
      .notNull()
      .references(() => categories.slug, { onDelete: "cascade" }),
  },
  (table) => [
    index("subcollections_category_slug_idx").on(table.category_slug),
  ],
);

export type Subcollection = typeof subcollections.$inferSelect;

export const subcategories = sqliteTable(
  "subcategories",
  {
    slug: text().notNull().primaryKey(),
    name: text().notNull(),
    subcollection_id: integer()
      .notNull()
      .references(() => subcollections.id, { onDelete: "cascade" }),
    image_url: text(),
  },
  (table) => [
    index("subcategories_subcollection_id_idx").on(table.subcollection_id),
  ],
);

export type Subcategory = typeof subcategories.$inferSelect;

export const products = sqliteTable(
  "products",
  {
    slug: text().notNull().primaryKey(),
    name: text().notNull(),
    description: text().notNull(),
    price: numeric({ mode: "string" }).notNull(),
    subcategory_slug: text()
      .notNull()
      .references(() => subcategories.slug, { onDelete: "cascade" }),
    image_url: text(),
  },
  (table) => [
    index("products_name_idx").on(table.name),
    index("products_subcategory_slug_idx").on(table.subcategory_slug),
  ],
);

export type Product = typeof products.$inferSelect;

export const users = sqliteTable("users", {
  id: integer().primaryKey({ autoIncrement: true }),
  username: text().notNull().unique(),
  passwordHash: text().notNull(),
  createdAt: integer({ mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer({ mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date()),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
