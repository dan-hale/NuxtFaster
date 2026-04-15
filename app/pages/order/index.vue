<script setup lang="ts">
import { X } from 'lucide-vue-next'

definePageMeta({ shopChrome: false, authHeaderSsr: true })

useSeoMeta({ title: 'Order' })

const { data: items, refresh: refreshItems } = await useFetch('/api/cart/items', {
  key: 'cart-items',
  default: () => [],
})

const { data: me } = await useFetch('/api/me', { key: 'me' })

const total = computed(() => {
  const list = items.value ?? []
  const n = list.reduce(
    (acc, it) => acc + it.quantity * Number(it.price),
    0,
  )
  return n.toFixed(2)
})

const removing = ref<string | null>(null)

async function removeLine(productSlug: string) {
  removing.value = productSlug
  try {
    await $fetch('/api/cart/remove', {
      method: 'POST',
      body: { productSlug },
    })
    await refreshItems()
    await refreshNuxtData(['cart-badge', 'cart-items'])
  }
  finally {
    removing.value = null
  }
}
</script>

<template>
  <main class="min-h-screen sm:p-4">
    <div class="container mx-auto p-1 sm:p-3">
      <div class="flex items-center justify-between border-b border-gray-200">
        <h1 class="text-2xl text-accent1">
          Order
        </h1>
      </div>

      <div class="flex grid-cols-3 flex-col gap-8 pt-4 lg:grid">
        <div class="col-span-2">
          <template v-if="(items?.length ?? 0) > 0">
            <div class="pb-4">
              <p class="font-semibold text-accent1">
                Delivers in 2-4 weeks
              </p>
              <p class="text-sm text-gray-500">
                Need this sooner?
              </p>
            </div>
            <div class="flex flex-col space-y-10">
              <div
                v-for="item in items"
                :key="item.slug"
                class="flex flex-row items-center justify-between border-t border-gray-200 pt-4"
              >
                <AppLink
                  :to="`/products/${item.subcategory.subcollection.category_slug}/${item.subcategory.slug}/${item.slug}`"
                >
                  <div class="flex flex-row space-x-2">
                    <div class="flex h-24 w-24 items-center justify-center bg-gray-100">
                      <img
                        loading="eager"
                        decoding="sync"
                        :src="item.image_url ?? '/placeholder.svg'"
                        alt="Product"
                        width="256"
                        height="256"
                        class="max-h-full max-w-full object-contain"
                      >
                    </div>
                    <div class="max-w-[100px] flex-grow sm:max-w-full">
                      <h2 class="font-semibold">
                        {{ item.name }}
                      </h2>
                      <p class="text-sm md:text-base">
                        {{ item.description }}
                      </p>
                    </div>
                  </div>
                </AppLink>
                <div class="flex items-center justify-center md:space-x-10">
                  <div class="flex flex-col-reverse md:flex-row md:gap-4">
                    <p>{{ item.quantity }}</p>
                    <div class="min-w-8 text-sm md:min-w-24 md:text-base md:block">
                      <p>${{ Number(item.price).toFixed(2) }} each</p>
                    </div>
                    <div class="min-w-24">
                      <p class="font-semibold">
                        ${{ (item.quantity * Number(item.price)).toFixed(2) }}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    class="p-1"
                    :disabled="removing === item.slug"
                    aria-label="Remove from cart"
                    @click="removeLine(item.slug)"
                  >
                    <X class="h-6 w-6" />
                  </button>
                </div>
              </div>
            </div>
          </template>
          <p v-else>
            No items in cart
          </p>
        </div>

        <div class="space-y-4">
          <div class="rounded bg-gray-100 p-4">
            <p class="font-semibold">
              Merchandise <span>${{ total }}</span>
            </p>
            <p class="text-sm text-gray-500">
              Applicable shipping and tax will be added.
            </p>
          </div>
          <div v-if="!me" class="space-y-3">
            <p class="font-semibold text-accent1">
              Log in to place an order
            </p>
            <AuthMenu compact />
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
