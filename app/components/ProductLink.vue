<script setup lang="ts">
import type { Product } from "~~/db/schema";

const props = defineProps<{
  product: Product;
  categorySlug: string;
  subcategorySlug: string;
  imageUrl?: string | null;
  loading?: "eager" | "lazy";
}>();

const src = computed(
  () =>
    props.imageUrl ?? "/placeholder.svg?height=48&width=48",
);
</script>

<template>
  <AppLink
    class="group flex h-[130px] w-full flex-row border px-4 py-2 hover:bg-gray-100 sm:w-[250px]"
    :to="`/products/${categorySlug}/${subcategorySlug}/${product.slug}`"
  >
    <div class="py-2">
      <NuxtImg
        :loading="loading ?? 'lazy'"
        decoding="sync"
        :placeholder="NuxtImgPlaceholderDefault"
        preload
        :src="src"
        :alt="`A small picture of ${product.name}`"
        class="h-auto w-12 flex-shrink-0 object-cover"
        width="48"
        height="48"
        sizes="64px"
        fit="cover"
      />
    </div>
    <div class="px-2" />
    <div class="flex h-26 flex-grow flex-col items-start py-2">
      <div class="text-sm font-medium text-gray-700 group-hover:underline">
        {{ product.name }}
      </div>
      <p class="overflow-hidden text-xs">
        {{ product.description }}
      </p>
    </div>
  </AppLink>
</template>
