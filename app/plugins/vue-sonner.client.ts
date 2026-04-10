import { defineComponent, h } from "vue";
import { Toaster } from "vue-sonner";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component(
    "AppToaster",
    defineComponent({
      name: "AppToaster",
      setup() {
        return () => h(Toaster, { closeButton: true });
      },
    }),
  );
});
