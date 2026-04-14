<script setup lang="ts">
definePageMeta({ shopChrome: true, keepalive: true })

useSeoMeta({ title: "NuxtFaster" });

const { data: collections } = await useFetch("/api/collections", {
  key: "collections",
});

const { data: productCount } = await useFetch("/api/product-count", {
  key: "product-count",
});

</script>

<template>
  <div class="w-full p-4">
    <div
      class="mb-2 w-full flex-grow border-b border-accent1 text-sm font-semibold text-black"
    >
      Explore {{ (productCount ?? 0).toLocaleString() }} products
    </div>
    <div v-for="collection in collections ?? []" :key="collection.name">
      <h2 class="text-xl font-semibold">
        {{ collection.name }}
      </h2>
      <div
        class="flex flex-row flex-wrap justify-center gap-2 border-b-2 py-4 sm:justify-start"
      >
        <AppLink
          v-for="category in collection.categories"
          :key="category.name"
          class="flex w-[125px] flex-col items-center text-center"
          :to="`/products/${category.slug}`"
        >
          <NuxtImg
            loading="lazy"
            decoding="sync"
            :placeholder="NuxtImgPlaceholderDefault"
            preload
            :src="category.image_url ?? '/placeholder.svg'"
            :alt="`A small picture of ${category.name}`"
            class="mb-2 h-14 w-14 border hover:bg-accent2"
            width="56"
            height="56"
            sizes="56px"
            fit="cover"
          />
          <span class="text-xs">{{ category.name }}</span>
        </AppLink>
      </div>
    </div>
  </div>
</template>
