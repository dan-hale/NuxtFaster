<script setup lang="ts">
import type { Category, Collection } from "~~/db/schema";

definePageMeta({ shopChrome: true });

useSeoMeta({ title: "NuxtFaster" });

type CollectionRow = Collection & { categories: Category[] };

const { data: collections } = await useFetch<CollectionRow[]>("/api/collections", {
  key: "collections",
});

const { data: productCount } = await useFetch<number>("/api/product-count", {
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
          <img
            loading="lazy"
            decoding="sync"
            :src="category.image_url ?? '/placeholder.svg'"
            :alt="`A small picture of ${category.name}`"
            class="mb-2 h-14 w-14 border hover:bg-accent2"
            width="48"
            height="48"
          >
          <span class="text-xs">{{ category.name }}</span>
        </AppLink>
      </div>
    </div>
  </div>
</template>
