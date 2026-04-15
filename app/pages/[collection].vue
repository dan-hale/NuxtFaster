<script setup lang="ts">
definePageMeta({ shopChrome: true, keepalive: true })

const route = useRoute()
const slug = computed(() => String(route.params.collection))

const { data: rows } = await useFetch(() => `/api/collection/${slug.value}`, {
  onResponseError({ response }) {
    if (response.status === 404) {
      showError({
        statusCode: 404,
        statusMessage: 'Collection not found',
        fatal: true,
      })
    }
  },
})

useSeoMeta({
  title: () => rows.value?.[0]?.name ?? "Collection",
});
</script>

<template>
  <div class="w-full p-4">
    <div v-if="rows?.length">
      <div v-for="(collection, coli) in rows" :key="collection.name">
        <h2 class="text-xl font-semibold">
          {{ collection.name }}
        </h2>
        <div
          class="flex flex-row flex-wrap justify-center gap-2 border-b-2 py-4 sm:justify-start"
        >
          <AppLink
            v-for="(category, ci) in collection.categories"
            :key="category.name"
            class="flex w-[125px] flex-col items-center text-center"
            :to="`/products/${category.slug}`"
          >
            <NuxtImg
              :loading="coli + ci < 15 ? 'eager' : 'lazy'"
              decoding="sync"
              :placeholder="NuxtImgPlaceholderDefault"
              :preload="{ fetchPriority: 'low' }"
              :src="category.image_url ?? '/placeholder.svg'"
              :alt="`A small picture of ${category.name}`"
              class="mb-2 h-14 w-14 border hover:bg-accent2"
              width="56"
              height="56"
              sizes="64px"
              fit="cover"
            />
            <span class="text-xs">{{ category.name }}</span>
          </AppLink>
        </div>
      </div>
    </div>
  </div>
</template>
