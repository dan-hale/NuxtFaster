<script setup lang="ts">
const { data } = useFetch("/api/cart/badge", {
  key: "cart-badge",
});
</script>

<template>
  <div
    v-if="data && data.totalQuantity > 0"
    class="absolute -right-3 -top-1 rounded-full bg-accent2 px-1 text-xs text-accent1"
  >
    {{ data.totalQuantity }}
  </div>
</template>
