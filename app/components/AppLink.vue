<script setup lang="ts">
import type { RouteLocationRaw, UseLinkReturn } from 'vue-router'

withDefaults(defineProps<{
  to: RouteLocationRaw
  prefetch?: boolean
}>(), {
  prefetch: true,
})
type Navigate = UseLinkReturn['navigate']

/** Suppress the redundant mouse `click` after pointerdown; `detail === 0` is keyboard activation. */
function onClick(e: MouseEvent, navigate: Navigate) {
  e.detail === 0 ? navigate(e) : e.preventDefault()
}
</script>

<template>
  <NuxtLink
    v-slot="{ href, navigate }"
    :to
    :prefetch
    prefetch-on="visibility"
    custom
  >
    <a
      v-bind="$attrs"
      :href="href"
      @pointerdown="navigate($event)"
      @click="onClick($event, navigate)"
    >
      <slot />
    </a>
  </NuxtLink>
</template>
