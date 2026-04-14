<script setup lang="ts">
import { X } from "lucide-vue-next";

const dismissed = useCookie<string | null>("welcome-toast", {
  path: "/",
  maxAge: 60 * 60 * 24 * 365,
  sameSite: "lax",
  default: () => null,
});

const show = ref(false);

onMounted(() => {
  if (window.innerHeight < 850) return;
  if (dismissed.value === "3") return;
  show.value = true;
});

function dismiss() {
  dismissed.value = "3";
  show.value = false;
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="show"
      class="fixed bottom-16 right-4 z-[60] w-[min(100vw-2rem,22rem)] rounded-lg border-2 border-accent2 bg-background p-4 font-sans shadow-lg sm:bottom-8"
      role="status"
      aria-live="polite"
    >
      <div class="flex items-start justify-between gap-2">
        <p class="text-sm font-semibold text-foreground">
          🚀 Welcome to NuxtFaster!
        </p>
        <button
          type="button"
          class="shrink-0 rounded p-0.5 text-muted-foreground hover:bg-accent2 hover:text-foreground"
          aria-label="Dismiss welcome message"
          @click="dismiss"
        >
          <X class="size-4" />
        </button>
      </div>
      <p class="mt-2 text-xs leading-relaxed text-muted-foreground">
        This is a highly performant e-commerce template using Nuxt. All of the products on this site are AI generated.
      </p>
      <hr class="my-2 border-accent2">
      <p class="text-xs leading-relaxed text-muted-foreground">
        This demo highlights a full-stack Nuxt site.
        <a
          href="https://github.com/ethanniser/NextFaster"
          class="font-semibold text-accent1 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >Get the Source</a>.
      </p>
    </div>
  </Teleport>
</template>
