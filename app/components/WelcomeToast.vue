<script setup lang="ts">
import { h } from "vue";
import { toast } from "vue-sonner";

const dismissed = useCookie<string | null>("welcome-toast", {
  path: "/",
  maxAge: 60 * 60 * 24 * 365,
  sameSite: "lax",
  default: () => null,
});

onMounted(() => {
  if (import.meta.server) return;
  if (window.innerHeight < 850) return;
  if (dismissed.value === "3") return;

  toast("🚀 Welcome to NuxtFaster!", {
    id: "welcome-toast",
    duration: Infinity,
    onDismiss: () => {
      dismissed.value = "3";
    },
    description: h("div", [
      h(
        "span",
        "This is a highly performant e-commerce template using Nuxt. All of the products on this site are AI generated.",
      ),
      h("hr", { class: "my-2" }),
      h("span", "This demo highlights a full-stack Nuxt site. "),
      h(
        "a",
        {
          href: "https://github.com/ethanniser/NextFaster",
          class: "font-semibold text-accent1 hover:underline",
          target: "_blank",
          rel: "noopener noreferrer",
        },
        "Get the Source",
      ),
      h("span", "."),
    ]),
  });
});
</script>

<template>
  <span />
</template>
