<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'
import type { PrefetchedPageImage } from '~~/server/types/prefetched-page-image'

const props = withDefaults(
  defineProps<{
    to: string
    prefetch?: boolean
  }>(),
  { prefetch: true },
)

const router = useRouter()
const nuxtApp = useNuxtApp()
const anchorRef = useTemplateRef<HTMLAnchorElement>('anchorRef')
const imageCache = useState<Record<string, PrefetchedPageImage[]>>(
  'link-image-prefetch',
  () => ({}),
)

/** Warm route chunks + link hooks (mirrors Next `router.prefetch`). Custom `NuxtLink` slots do not get interaction prefetch listeners. */
function prefetchRouteChunks() {
  if (!import.meta.client || props.prefetch === false)
    return
  const href = props.to
  if (!href.startsWith('/') || href.startsWith('/order') || href === '/')
    return
  const fullPath = router.resolve(href as RouteLocationRaw).fullPath
  void Promise.resolve(nuxtApp.hooks.callHook('link:prefetch', fullPath)).catch(
    () => {},
  )
  void preloadRouteComponents(href, router).catch(() => {})
}

async function prefetchImages() {
  const href = props.to
  if (!href.startsWith('/') || href.startsWith('/order') || href === '/') {
    return
  }
  if (imageCache.value[href])
    return
  try {
    const origin = import.meta.client
      ? window.location.origin
      : useRequestURL().origin
    const u = new URL(href, origin)
    const res = await $fetch(`/api/prefetch-images${u.pathname}`)
    imageCache.value[href] = res.images
  }
  catch {
    /* ignore */
  }
}

function applyPrefetchImages() {
  const images = imageCache.value[props.to]
  if (!images)
    return
  for (const image of images) {
    if (image.loading === 'lazy' || !image.srcset)
      continue
    const img = new Image()
    img.decoding = 'async';
    (img as HTMLImageElement & { fetchPriority?: string }).fetchPriority
      = 'low'
    if (image.sizes)
      img.sizes = image.sizes
    img.srcset = image.srcset
    if (image.src)
      img.src = image.src
    if (image.alt)
      img.alt = image.alt
  }
}

onMounted(() => {
  if (!anchorRef.value || props.prefetch === false)
    return
  const { stop } = useIntersectionObserver(
    anchorRef,
    ([entry]) => {
      if (entry?.isIntersecting) {
        setTimeout(() => {
          prefetchRouteChunks()
          void prefetchImages()
          stop()
        }, 300)
      }
    },
    { threshold: 0.1 },
  )
})

/**
 * `navigate` on pointerdown already runs Vue Router's `guardEvent` (modifiers, non-primary button, `_blank`, etc.).
 * Mouse then fires a redundant `click` on the `<a>` — cancel it. Keyboard activation uses `click` with `detail === 0`.
 */
function onAnchorClick(
  e: MouseEvent,
  navigate: (e?: MouseEvent) => void | Promise<unknown>,
) {
  if (e.detail === 0)
    void navigate(e)
  else e.preventDefault()
}
</script>

<template>
  <NuxtLink
    v-slot="{ href, navigate }"
    :to="to"
    :prefetch
    custom
  >
    <a
      ref="anchorRef"
      v-bind="$attrs"
      :href="href"
      @pointerdown="navigate"
      @click="onAnchorClick($event, navigate)"
      @mouseenter="
        () => {
          prefetchRouteChunks();
          void prefetchImages().then(() => applyPrefetchImages());
        }
      "
    >
      <slot />
    </a>
  </NuxtLink>
</template>
