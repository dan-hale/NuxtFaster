<script setup lang="ts">
const props = defineProps<{ productSlug: string }>();

const pending = ref(false);
const message = ref<string | null>(null);

async function onSubmit() {
  pending.value = true;
  message.value = null;
  try {
    const res = await $fetch<{ message?: string }>("/api/cart/add", {
      method: "POST",
      body: { productSlug: props.productSlug },
    });
    message.value = res.message ?? null;
    await refreshNuxtData(["cart-badge", "cart-items", "cart-total"]);
  } finally {
    pending.value = false;
  }
}
</script>

<template>
  <form class="flex flex-col gap-2" @submit.prevent="onSubmit">
    <button
      type="submit"
      class="max-w-[150px] rounded-[2px] bg-accent1 px-5 py-1 text-sm font-semibold text-white"
    >
      Add to cart
    </button>
    <p v-if="pending">
      Adding to cart...
    </p>
    <p v-else-if="message">
      {{ message }}
    </p>
  </form>
</template>
