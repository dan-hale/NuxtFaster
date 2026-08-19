<script setup lang="ts">
const props = defineProps<{
  title: string
  description?: string
  image?: string | null
}>()

const blurb = computed(() => {
  const text = props.description?.trim() ?? ''
  if (text.length <= 200)
    return text
  return `${text.slice(0, 199)}…`
})
</script>

<template>
  <div class="w-full h-full flex flex-row items-center bg-white p-16">
    <img
      v-if="image"
      :src="image"
      width="360"
      height="360"
      class="w-[360px] h-[360px] object-cover mr-16"
    >
    <div class="flex flex-1 flex-col justify-center">
      <div class="text-5xl font-bold leading-tight text-black">
        {{ title }}
      </div>
      <div
        v-if="blurb"
        class="mt-6 text-2xl leading-snug text-gray-500"
      >
        {{ blurb }}
      </div>
    </div>
  </div>
</template>
