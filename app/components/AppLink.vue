<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

defineProps<{
  to: RouteLocationRaw
}>()
</script>

<template>
  <NuxtLink
    :to
    prefetch
    prefetch-on="interaction"
    @pointerdown="navigateTo(to)"
  >
    <slot />
  </NuxtLink>
</template>
