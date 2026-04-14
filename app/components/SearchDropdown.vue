<script setup lang="ts">
import type { SearchHit } from '~~/server/api/search.get'
import { X } from 'lucide-vue-next'
import { cn } from '~/utils/cn'

const searchTerm = ref('')

const searchQuery = computed(() => ({ q: searchTerm.value.trim() }))

const queryDebounced = useDebounce(searchQuery, 250)

const { data, pending } = useLazyFetch('/api/search', {
  query: queryDebounced,
  server: false,
  watch: [queryDebounced],
  default: () => [],
  immediate: false,
})

const displayItems = computed(() => {
  if (!searchTerm.value.trim())
    return []
  return data.value ?? []
})

const isLoading = computed(
  () => pending.value && searchTerm.value.trim().length > 0,
)

const open = ref(false)

watch(searchTerm, (v) => {
  if (!v.trim())
    open.value = false
})

const route = useRoute()
const router = useRouter()

watch(
  () => route.params,
  (params) => {
    if (!params.product) {
      const sub = params.subcategory
      searchTerm.value
        = typeof sub === 'string' ? sub.replaceAll('-', ' ') : ''
    }
  },
  { immediate: true },
)

function clearSearch() {
  searchTerm.value = ''
  open.value = false
}

function onItemSelect(item: SearchHit, event: Event) {
  event.preventDefault()
  void router.push(item.href)
  searchTerm.value = item.name
  open.value = false
}
</script>

<template>
  <ComboboxRoot
    v-model:open="open"
    ignore-filter
    :reset-search-term-on-blur="false"
    :reset-search-term-on-select="false"
    class="font-sans"
  >
    <ComboboxAnchor class="relative flex-grow">
      <div class="relative">
        <ComboboxInput
          v-model="searchTerm"
          auto-capitalize="off"
          auto-correct="off"
          placeholder="Search..."
          :class="
            cn(
              'flex h-9 w-full border border-gray-500 bg-transparent px-3 py-1 pr-12 text-sm font-sans font-medium outline-none sm:w-[300px] md:w-[375px]',
            )
          "
        />
        <button
          v-show="open"
          type="button"
          class="absolute right-7 top-2 rounded p-0.5 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Clear search"
          @pointerdown.prevent
          @click="clearSearch"
        >
          <X class="h-5 w-5 cursor-pointer" />
        </button>
      </div>
    </ComboboxAnchor>
    <ComboboxContent
      position="inline"
      :hide-when-empty="false"
      class="z-10 w-full border border-gray-200 bg-white shadow-lg"
    >
      <ComboboxViewport class="relative max-h-[300px] overflow-y-auto">
        <template v-if="displayItems.length > 0">
          <ComboboxItem
            v-for="item in displayItems"
            :key="item.slug"
            :value="item.slug"
            :text-value="item.name"
            @select="onItemSelect(item, $event)"
          >
            <div class="flex cursor-pointer items-center p-2">
              <NuxtImg
                loading="eager"
                decoding="sync"
                :placeholder="NuxtImgPlaceholderDefault"
                :preload="{ fetchPriority: 'low' }"
                :src="item.image_url ?? '/placeholder.svg'"
                alt=""
                class="h-10 w-10 pr-2"
                width="40"
                height="40"
                sizes="40px"
                fit="cover"
              />
              <span class="text-sm">{{ item.name }}</span>
            </div>
          </ComboboxItem>
        </template>
        <div
          v-else-if="isLoading"
          class="flex h-full items-center justify-center py-8"
        >
          <p class="text-sm text-gray-500">
            Loading...
          </p>
        </div>
        <div
          v-else
          class="flex h-full items-center justify-center py-8"
        >
          <p class="text-sm text-gray-500">
            No results found
          </p>
        </div>
      </ComboboxViewport>
    </ComboboxContent>
  </ComboboxRoot>
</template>
