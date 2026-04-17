/**
 * Client-side plugin that prefetches images for routes when NuxtLink triggers prefetch.
 *
 * Instead of fetching the full page payload, this plugin calls a lightweight
 * /api/prefetch-urls endpoint that returns only the image URLs for a route.
 * This is significantly more efficient than parsing the full payload.
 */
export default defineNuxtPlugin((nuxtApp) => {
  // Track which images have already been prefetched
  const prefetchedImageUrls = new Set<string>()
  // Track which routes we've already processed
  const processedRoutes = new Set<string>()

  nuxtApp.hook('link:prefetch', async (to) => {
    const path = normalizePath(to)
    if (processedRoutes.has(path)) return
    processedRoutes.add(path)

    try {
      // Fetch only the image URLs for this route (lightweight endpoint)
      const { urls } = await $fetch<{ urls: string[] }>('/api/prefetch-urls', {
        query: { path },
        priority: 'low',
      } as Parameters<typeof $fetch>[1])

      if (urls?.length > 0) {
        const newUrls = urls.filter(url => !prefetchedImageUrls.has(url))
        newUrls.forEach(url => prefetchedImageUrls.add(url))

        if (newUrls.length > 0) {
          prefetchImages(newUrls)
        }
      }
    }
    catch {
      // Silently fail - prefetching is an optimization
    }
  })

  /**
   * Normalize path for consistent comparison
   */
  function normalizePath(to: string | object): string {
    const path = typeof to === 'string' ? to : (to as { path?: string }).path ?? ''
    return path === '/' ? path : path.replace(/\/$/, '')
  }
})

/**
 * Prefetches images using link rel="prefetch" for browser-native handling
 */
function prefetchImages(urls: string[]) {
  const prefetch = () => {
    for (const url of urls) {
      if (document.querySelector(`link[href="${CSS.escape(url)}"]`)) continue

      const link = document.createElement('link')
      link.rel = 'prefetch'
      link.as = 'image'
      link.href = url
      link.setAttribute('fetchpriority', 'low')
      document.head.appendChild(link)
    }
  }

  if ('requestIdleCallback' in window) {
    requestIdleCallback(prefetch, { timeout: 2000 })
  }
  else {
    setTimeout(prefetch, 100)
  }
}
