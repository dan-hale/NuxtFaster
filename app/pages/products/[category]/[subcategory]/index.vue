<script setup lang="ts">
definePageMeta({ shopChrome: true, keepalive: true })

const route = useRoute()
const subSlug = computed(() => String(route.params.subcategory))

const { data } = await useFetch(() => `/api/subcategory/${subSlug.value}`, {
  onResponseError({ response }) {
    if (response.status === 404) {
      showError({
        statusCode: 404,
        statusMessage: 'Subcategory not found',
        fatal: true,
      })
    }
  },
})

useSeoMeta({
  title: () => data.value?.subcategory?.name ?? "Products",
})


</script>

<template>
  <div v-if="data" class="container mx-auto p-4">
    <h1
      v-if="data.count > 0"
      class="mb-2 border-b-2 text-sm font-bold"
    >
      {{ data.count }} {{ data.count === 1 ? "Product" : "Products" }}
    </h1>
    <p v-else>
      No products for this subcategory
    </p>
    <div class="flex flex-row flex-wrap gap-2">
      <ProductLink
        v-for="product in data.products"
        :key="product.slug"
        loading="eager"
        :product="product"
        :category-slug="String(route.params.category)"
        :subcategory-slug="String(route.params.subcategory)"
        :image-url="product.image_url"
      />
    </div>
  </div>
</template>
