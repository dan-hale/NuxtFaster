<script setup lang="ts">
import type { NuxtError } from "#app";

const props = defineProps<{
  error: NuxtError;
}>();

function handleError() {
  clearError({ redirect: "/" });
}
</script>

<template>
  <div class="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-8 text-center">
    <h1 class="text-2xl font-bold text-accent1">
      {{ error.statusCode }}
    </h1>
    <p class="text-muted-foreground">
      {{ error.statusMessage || "Something went wrong" }}
    </p>
    <button
      type="button"
      class="rounded-md border border-accent1 px-4 py-2 text-sm font-semibold text-accent1 hover:bg-accent2"
      @click="handleError"
    >
      Back to home
    </button>
  </div>
</template>
