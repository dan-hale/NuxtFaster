<script setup lang="ts">
definePageMeta({ shopChrome: true, keepalive: true })

const route = useRoute()

const { data: productData } = await useFetch(() => `/api/product/${route.params.product}`)

const { data: subData } = await useFetch(() => `/api/subcategory/${route.params.subcategory}`)

const related = computed(() => {
  const list = subData.value?.products ?? []
  const p = productData.value
  if (!p)
    return []
  const idx = list.findIndex(x => x.slug === p.slug)
  if (idx < 0)
    return list.filter(x => x.slug !== p.slug)
  return [...list.slice(idx + 1), ...list.slice(0, idx)]
})

useSeoMeta({
  title: () => productData.value?.name ?? 'Product',
})
</script>

<template>
  <div v-if="productData" class="container p-4">
    <h1 class="border-t-2 pt-1 text-xl font-bold text-accent1">
      {{ productData.name }}
    </h1>
    <div class="flex flex-col gap-2">
      <div class="flex flex-row gap-2">
        <NuxtImg
          loading="eager"
          decoding="sync"
          :placeholder="NuxtImgPlaceholderDefault"
          :src="productData.image_url ?? '/placeholder.svg?height=64&width=64'"
          :alt="`A small picture of ${productData.name}`"
          width="256"
          height="256"
          class="h-56 w-56 flex-shrink-0 border-2 md:h-64 md:w-64"
          fit="contain"
          :preload="{ fetchPriority: 'high' }"
        />
        <p class="flex-grow text-base">
          {{ productData.description }}
        </p>
      </div>
      <p class="text-xl font-bold">
        ${{ Number.parseFloat(String(productData.price)).toFixed(2) }}
      </p>
      <AddToCartForm :product-slug="productData.slug" />
    </div>
    <div v-if="related.length" class="pt-8">
      <h2 class="text-lg font-bold text-accent1">
        Explore more products
      </h2>
      <div class="flex flex-row flex-wrap gap-2">
        <ProductLink
          v-for="product in related"
          :key="product.slug"
          loading="lazy"
          :product="product"
          :category-slug="route.params.category as string"
          :subcategory-slug="route.params.subcategory as string"
          :image-url="product.image_url"
        />
      </div>
    </div>
  </div>
</template>
