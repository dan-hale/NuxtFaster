<script setup lang="ts">
definePageMeta({ shopChrome: true })

const route = useRoute()
const slug = computed(() => decodeURIComponent(String(route.params.category)))

const { data } = await useFetch(
  () => `/api/category/${encodeURIComponent(slug.value)}`,
  {
    key: () => `category-${slug.value}`,
    watch: [slug],
    onResponseError({ response }) {
      if (response.status === 404) {
        showError({
          statusCode: 404,
          statusMessage: 'Category not found',
          fatal: true,
        })
      }
    },
  },
)

useSeoMeta({
  title: () => data.value?.category?.name ?? 'Category',
})
</script>

<template>
  <div v-if="data?.category" class="container p-4">
    <h1
      v-if="data.count"
      class="mb-2 border-b-2 text-sm font-bold"
    >
      {{ data.count }} {{ data.count === 1 ? "Product" : "Products" }}
    </h1>
    <div class="space-y-4">
      <div
        v-for="(subcollection, index) in data.category.subcollections"
        :key="index"
      >
        <h2 class="mb-2 border-b-2 text-lg font-semibold">
          {{ subcollection.name }}
        </h2>
        <div class="flex flex-row flex-wrap gap-2">
          <AppLink
            v-for="(subcategory, si) in subcollection.subcategories"
            :key="si"
            class="group flex h-full w-full flex-row gap-2 border px-4 py-2 hover:bg-gray-100 sm:w-[200px]"
            :to="`/products/${route.params.category}/${subcategory.slug}`"
          >
            <div class="py-2">
              <NuxtImg
                loading="eager"
                decoding="sync"
                :placeholder="NuxtImgPlaceholderDefault"
                :preload="{ fetchPriority: 'low' }"
                :src="subcategory.image_url ?? '/placeholder.svg'"
                :alt="`A small picture of ${subcategory.name}`"
                width="48"
                height="48"
                sizes="48px"
                class="h-12 w-12 flex-shrink-0 object-cover"
                fit="cover"
              />
            </div>
            <div class="flex h-16 flex-grow flex-col items-start py-2">
              <div class="text-sm font-medium text-gray-700 group-hover:underline">
                {{ subcategory.name }}
              </div>
            </div>
          </AppLink>
        </div>
      </div>
    </div>
  </div>
</template>
