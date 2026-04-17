import type { MaybeRefOrGetter } from 'vue'

/**
 * Registers image URLs to be prefetched when the page is prefetched via NuxtLink.
 * URLs are added to the page payload under a namespaced key, and a client plugin
 * will pick them up on the `link:prefetch` hook.
 *
 * @param urls - Array of image URLs to prefetch (can be a ref, getter, or static array)
 * @param key - Unique key to namespace this set of URLs in the payload
 */
export function usePrefetchURLs(
  urls: MaybeRefOrGetter<string[]>,
  key: MaybeRefOrGetter<string>,
) {
  const nuxtApp = useNuxtApp()
  const route = useRoute()

  // Initialize the prefetch URLs map in payload if it doesn't exist
  nuxtApp.payload.prefetchURLs ??= {}

  // Watch for changes and update the payload
  watchEffect(() => {
    const resolvedUrls = toValue(urls)
    const resolvedKey = toValue(key)

    if (resolvedUrls.length > 0) {
      // Store URLs in payload keyed by route path + custom key
      const payloadKey = `${route.path}:${resolvedKey}`
      nuxtApp.payload.prefetchURLs[payloadKey] = resolvedUrls
    }
  })
}

// Type augmentation for the payload
declare module '#app' {
  interface NuxtPayload {
    prefetchURLs?: Record<string, string[]>
  }
}
