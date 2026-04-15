<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

withDefaults(defineProps<{
  to: RouteLocationRaw
  prefetch?: boolean
}>(), {
  prefetch: true,
})

/** Router `navigate(e)` applies the same checks as native links (modifiers, button, `_blank`, …). */
function onPointerDown(
  e: PointerEvent,
  navigate: (e?: MouseEvent) => void | Promise<unknown>,
) {
  void navigate(e)
}

/** Suppress the redundant mouse `click` after pointerdown; `detail === 0` is keyboard activation. */
function onClick(
  e: MouseEvent,
  navigate: (e?: MouseEvent) => void | Promise<unknown>,
) {
  if (e.detail === 0)
    void navigate(e)
  else
    e.preventDefault()
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
      @pointerdown="onPointerDown($event, navigate)"
      @click="onClick($event, navigate)"
    >
      <slot />
    </a>
  </NuxtLink>
</template>
