<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    to: string;
    prefetch?: boolean;
    class?: string;
  }>(),
  { prefetch: true },
);

const wrap = ref<HTMLElement | null>(null);
const imageCache = useState<Record<string, Awaited<ReturnType<typeof $fetch>>>>(
  "link-image-prefetch",
  () => ({}),
);

async function prefetchImages() {
  const href = props.to;
  if (!href.startsWith("/") || href.startsWith("/order") || href === "/") {
    return;
  }
  if (imageCache.value[href]) return;
  try {
    const origin = import.meta.client
      ? window.location.origin
      : useRequestURL().origin;
    const u = new URL(href, origin);
    const res = await $fetch<{ images: PrefetchImg[] }>(
      `/api/prefetch-images${u.pathname}`,
    );
    imageCache.value[href] = res.images;
  } catch {
    /* ignore */
  }
}

type PrefetchImg = {
  srcset?: string | null;
  sizes?: string | null;
  src?: string | null;
  alt?: string | null;
  loading?: string | null;
};

function applyPrefetchImages() {
  const images = imageCache.value[props.to] as PrefetchImg[] | undefined;
  if (!images) return;
  for (const image of images) {
    if (image.loading === "lazy" || !image.srcset) continue;
    const img = new Image();
    img.decoding = "async";
    (img as HTMLImageElement & { fetchPriority?: string }).fetchPriority =
      "low";
    if (image.sizes) img.sizes = image.sizes;
    img.srcset = image.srcset;
    if (image.src) img.src = image.src;
    if (image.alt) img.alt = image.alt;
  }
}

onMounted(() => {
  if (!wrap.value || props.prefetch === false) return;
  const { stop } = useIntersectionObserver(
    wrap,
    ([entry]) => {
      if (entry?.isIntersecting) {
        setTimeout(() => {
          void prefetchImages();
          stop();
        }, 300);
      }
    },
    { threshold: 0.1 },
  );
});
</script>

<template>
  <div ref="wrap" class="contents">
    <NuxtLink
      :to="to"
      :prefetch="prefetch !== false"
      :class="class"
      @mouseenter="
        () => {
          void prefetchImages().then(() => applyPrefetchImages());
        }
      "
    >
      <slot />
    </NuxtLink>
  </div>
</template>

<style scoped>
.contents {
  display: contents;
}
</style>
