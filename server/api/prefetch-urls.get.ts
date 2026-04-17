import { z } from 'zod'

/**
 * Lightweight API endpoint that returns image URLs to prefetch for a given route.
 * This is more efficient than fetching the full page payload just for image URLs.
 *
 * The endpoint mirrors the data fetching logic from each page but only returns
 * the image URLs, making it a much smaller response.
 */
export default defineEventHandler(async (event) => {
  const { path } = await getValidatedQuery(
    event,
    z.object({
      path: z.string(),
    }).parse,
  )

  // Normalize path
  const normalizedPath = path === '/' ? path : path.replace(/\/$/, '')

  // Route-specific image URL extraction
  // This mirrors the data structure of each page
  const urls = await getImageUrlsForRoute(normalizedPath)

  // Set cache headers - these URLs don't change often
  setHeader(event, 'Cache-Control', 'public, max-age=60, stale-while-revalidate=300')

  return { urls }
})

async function getImageUrlsForRoute(path: string): Promise<string[]> {
  const storage = useStorage('data')
  const urls: string[] = []

  // Home page - collection category images
  if (path === '/') {
    const collections = await storage.getItem<Collection[]>('collections.json')
    if (collections) {
      for (const collection of collections) {
        for (const category of collection.categories) {
          if (category.image_url) urls.push(category.image_url)
        }
      }
    }
    return urls
  }

  // Collection page - /[collection]
  const collectionMatch = path.match(/^\/([^/]+)$/)
  if (collectionMatch && !path.startsWith('/products')) {
    const collectionSlug = collectionMatch[1]
    const collections = await storage.getItem<Collection[]>('collections.json')
    const collection = collections?.find(c => c.slug === collectionSlug)
    if (collection) {
      for (const category of collection.categories) {
        if (category.image_url) urls.push(category.image_url)
      }
    }
    return urls
  }

  // Category page - /products/[category]
  const categoryMatch = path.match(/^\/products\/([^/]+)$/)
  if (categoryMatch) {
    const categorySlug = categoryMatch[1]
    const categories = await storage.getItem<Category[]>('categories.json')
    const category = categories?.find(c => c.slug === categorySlug)
    if (category) {
      for (const subcollection of category.subcollections) {
        for (const subcategory of subcollection.subcategories) {
          if (subcategory.image_url) urls.push(subcategory.image_url)
        }
      }
    }
    return urls
  }

  // Subcategory page - /products/[category]/[subcategory]
  const subcategoryMatch = path.match(/^\/products\/([^/]+)\/([^/]+)$/)
  if (subcategoryMatch) {
    const [, , subcategorySlug] = subcategoryMatch
    const products = await storage.getItem<Product[]>('products.json')
    const filteredProducts = products?.filter(p => p.subcategory_slug === subcategorySlug)
    if (filteredProducts) {
      for (const product of filteredProducts) {
        if (product.image_url) urls.push(product.image_url)
      }
    }
    return urls
  }

  // Product page - /products/[category]/[subcategory]/[product]
  const productMatch = path.match(/^\/products\/([^/]+)\/([^/]+)\/([^/]+)$/)
  if (productMatch) {
    const [, , subcategorySlug, productSlug] = productMatch
    const products = await storage.getItem<Product[]>('products.json')
    const product = products?.find(p => p.slug === productSlug)
    if (product?.image_url) urls.push(product.image_url)

    // Related products
    const related = products
      ?.filter(p => p.subcategory_slug === subcategorySlug && p.slug !== productSlug)
      .slice(0, 4)
    if (related) {
      for (const p of related) {
        if (p.image_url) urls.push(p.image_url)
      }
    }
    return urls
  }

  return urls
}

// Type definitions (should match your actual data types)
interface Collection {
  slug: string
  categories: { image_url?: string }[]
}

interface Category {
  slug: string
  subcollections: {
    subcategories: { image_url?: string }[]
  }[]
}

interface Product {
  slug: string
  subcategory_slug: string
  image_url?: string
}
