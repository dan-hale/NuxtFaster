/**
 * In-process TTL cache (per server instance). Mirrors Next unstable_cache revalidate seconds.
 * Used alongside `routeRules` HTTP cache headers: routeRules shape browser/CDN caching; `withCache`
 * dedupes DB work per instance (not shared across horizontal replicas).
 */
export function withCache<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>,
  options: { maxAgeSeconds: number; name: string },
): (...args: TArgs) => Promise<TResult> {
  const store = new Map<string, { expires: number; data: TResult }>();
  return async (...args: TArgs) => {
    const key = `${options.name}:${JSON.stringify(args)}`;
    const now = Date.now();
    const hit = store.get(key);
    if (hit && hit.expires > now) {
      return hit.data;
    }
    const data = await fn(...args);
    store.set(key, {
      data,
      expires: now + options.maxAgeSeconds * 1000,
    });
    return data;
  };
}
