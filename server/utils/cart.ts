import type { H3Event } from "h3";
import { z } from "zod";
import { useDb } from "./db";

const cartSchema = z.array(
  z.object({
    productSlug: z.string(),
    quantity: z.number(),
  }),
);

export type CartItem = z.infer<typeof cartSchema>[number];

export function updateCart(event: H3Event, newItems: CartItem[]) {
  const isProd = process.env.NODE_ENV === "production";
  setCookie(event, "cart", JSON.stringify(newItems), {
    httpOnly: true,
    secure: isProd,
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}

export function getCart(event: H3Event): CartItem[] {
  const cart = getCookie(event, "cart");
  if (!cart) {
    return [];
  }
  try {
    return cartSchema.parse(JSON.parse(cart));
  } catch {
    console.error("Failed to parse cart cookie");
    return [];
  }
}

export async function detailedCart(event: H3Event) {
  const cart = getCart(event);
  if (cart.length === 0) return [];

  const db = useDb();
  const slugs = cart.map((item) => item.productSlug);

  const rows = await db.query.products.findMany({
    where: (p, { inArray }) => inArray(p.slug, slugs),
    with: {
      subcategory: {
        with: {
          subcollection: true,
        },
      },
    },
  });

  return rows.map((product) => ({
    ...product,
    quantity:
      cart.find((item) => item.productSlug === product.slug)?.quantity ?? 0,
  }));
}
