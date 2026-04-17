/**
 * Client-side plugin that listens for link:prefetch events and
 * prefetches associated image URLs stored in the target page's payload.
 *
 * When NuxtLink prefetches a route, this plugin fetches that page's payload
 * to get the image URLs registered via usePrefetchURLs, then prefetches those images.
 */
export default defineNuxtPlugin((nuxtApp) => {
  // Track which URLs have already been prefetched to avoid duplicates
  const prefetchedUrls = new Set<string>()
  // Track which routes we've already processed
  const processedRoutes = new Set<string>()

  nuxtApp.hook('link:prefetch', async (to) => {
    // Normalize the path
    const path = typeof to === 'string' ? to : to.toString()

    // Skip if we've already processed this route
    if (processedRoutes.has(path)) return
    processedRoutes.add(path)

    try {
      // Fetch the target page's payload
      // Nuxt stores payloads at /_payload/<path>.json or similar
      const payloadUrl = `${path}${path.endsWith('/') ? '' : '/'}__payload.json`

      const response = await fetch(payloadUrl, {
        priority: 'low',
      } as RequestInit)

      if (!response.ok) return

      const payload = await response.json()
      const prefetchURLs = payload?.prefetchURLs

      if (!prefetchURLs || typeof prefetchURLs !== 'object') return

      // Find all URL sets that match this route path
      const matchingKeys = Object.keys(prefetchURLs).filter(key =>
        key.startsWith(`${path}:`),
      )

      const urlsToPrefetch: string[] = []

      for (const key of matchingKeys) {
        const urls = prefetchURLs[key]
        if (Array.isArray(urls)) {
          for (const url of urls) {
            if (!prefetchedUrls.has(url)) {
              prefetchedUrls.add(url)
              urlsToPrefetch.push(url)
            }
          }
        }
      }

      // Prefetch images in the background
      if (urlsToPrefetch.length > 0) {
        prefetchImages(urlsToPrefetch)
      }
    }
    catch {
      // Silently fail - prefetching is an optimization, not critical
    }
  })
})

/**
 * Prefetches images using link rel="prefetch" for browser-native handling
 */
function prefetchImages(urls: string[]) {
  for (const url of urls) {
    // Skip if already prefetched via link element
    if (document.querySelector(`link[href="${url}"]`)) continue

    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.as = 'image'
    link.href = url
    document.head.appendChild(link)
  }
}
