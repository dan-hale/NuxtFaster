<script setup lang="ts">
import { cn } from "~/utils/cn";

const props = defineProps<{
  class?: string;
  type?: string;
}>();

const model = defineModel<string>({ default: "" });
</script>

<template>
  <input
    v-model="model"
    :type="props.type ?? 'text'"
    :class="
      cn(
        'flex h-9 w-full border border-gray-500 bg-transparent px-3 py-1 text-sm outline-none',
        props.class,
      )
    "
  />
</template>
