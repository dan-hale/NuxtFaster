import { Analytics } from "@vercel/analytics/vue";
import { SpeedInsights } from "@vercel/speed-insights/vue";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component("VercelAnalytics", Analytics);
  nuxtApp.vueApp.component("VercelSpeedInsights", SpeedInsights);
});
