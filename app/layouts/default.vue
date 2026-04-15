<script setup lang="ts">
import { Menu } from 'lucide-vue-next'

const route = useRoute()

const showShopSidebar = computed(() => Boolean(route.meta.shopChrome))

const { data: collections } = await useFetch('/api/collections')
</script>

<template>
  <div class="flex min-h-full flex-col overflow-y-auto overflow-x-hidden antialiased">
    <div>
      <header
        class="fixed top-0 z-10 flex h-[90px] w-[100vw] flex-grow items-center justify-between border-b-2 border-accent2 bg-background p-2 pb-[4px] pt-2 sm:h-[70px] sm:flex-row sm:gap-4 sm:p-4 sm:pb-[4px] sm:pt-0"
      >
        <div class="flex flex-grow flex-col">
          <div
            class="absolute right-2 top-2 flex justify-end pt-2 font-sans text-sm hover:underline sm:relative sm:right-0 sm:top-0"
          >
            <AuthMenu />
          </div>
          <div
            class="flex w-full flex-col items-start justify-center sm:w-auto sm:flex-row sm:items-center sm:gap-2"
          >
            <AppLink
              to="/"
              class="text-4xl font-bold text-accent1"
            >
              NuxtFaster
            </AppLink>
            <div class="flex w-full flex-row items-center justify-between gap-4">
              <div class="mx-0 flex-grow sm:mx-auto sm:flex-grow-0">
                <SearchDropdown />
              </div>
              <div class="flex flex-row justify-between gap-4">
                <div class="relative">
                  <AppLink
                    to="/order"
                    class="text-lg text-accent1 hover:underline"
                  >
                    ORDER
                  </AppLink>
                  <CartBadge />
                </div>
                <AppLink
                  to="/order-history"
                  class="hidden text-lg text-accent1 hover:underline md:block"
                >
                  ORDER HISTORY
                </AppLink>
                <AppLink
                  to="/order-history"
                  aria-label="Order History"
                  class="block text-lg text-accent1 hover:underline md:hidden"
                >
                  <Menu class="h-6 w-6" />
                </AppLink>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div class="pt-[85px] sm:pt-[70px]">
        <div v-if="showShopSidebar" class="flex flex-grow font-mono">
          <aside
            class="fixed left-0 hidden w-64 min-w-64 max-w-64 overflow-y-auto border-r p-4 md:block md:h-[calc(100vh-70px)]"
          >
            <h2 class="border-b border-accent1 text-sm font-semibold text-accent1">
              Choose a Category
            </h2>
            <ul class="flex flex-col items-start justify-center">
              <li
                v-for="collection in collections ?? []"
                :key="collection.slug"
                class="w-full"
              >
                <AppLink
                  :to="`/${collection.slug}`"
                  class="block w-full py-1 text-xs text-gray-800 hover:bg-accent2 hover:underline"
                >
                  {{ collection.name }}
                </AppLink>
              </li>
            </ul>
          </aside>
          <main
            id="main-content"
            class="min-h-[calc(100vh-113px)] w-full flex-1 overflow-y-auto p-4 pt-0 md:pl-64"
          >
            <slot />
          </main>
        </div>
        <div v-else>
          <slot />
        </div>
      </div>
    </div>
    <LayoutFooter />
    <WelcomeToast />
  </div>
</template>
