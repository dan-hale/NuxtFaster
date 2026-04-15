<script setup lang="ts">
withDefaults(
  defineProps<{
    compact?: boolean
  }>(),
  { compact: false },
)

const { data: me, refresh: refreshMe } = useFetch('/api/me', {
  key: 'me',
  server: false,
})

const username = ref('')
const password = ref('')
const error = ref<string | null>(null)
const pending = ref(false)

function messageFromAuthFetchError(e: unknown): string {
  const err = e as {
    data?: { message?: string, statusMessage?: string }
    statusMessage?: string
    message?: string
  }
  const d = err?.data
  if (d && typeof d === 'object') {
    const m = d.message ?? d.statusMessage
    if (typeof m === 'string')
      return m
  }
  if (typeof err?.statusMessage === 'string')
    return err.statusMessage
  if (typeof err?.message === 'string')
    return err.message
  return 'Something went wrong'
}

async function onSignIn(): Promise<boolean> {
  pending.value = true
  error.value = null
  try {
    const res = await $fetch('/api/auth/sign-in', {
      method: 'POST',
      body: { username: username.value, password: password.value },
    })
    if ('error' in res && res.error) {
      error.value
        = typeof res.error === 'string'
          ? res.error
          : res.error.message ?? 'Sign in failed'
      return false
    }
    username.value = ''
    password.value = ''
    await refreshMe()
    await refreshNuxtData(['cart-badge', 'cart-items'])
    return true
  }
  catch (e: unknown) {
    error.value = messageFromAuthFetchError(e)
    return false
  }
  finally {
    pending.value = false
  }
}

async function onSignUp(): Promise<boolean> {
  pending.value = true
  error.value = null
  try {
    const res = await $fetch('/api/auth/sign-up', {
      method: 'POST',
      body: { username: username.value, password: password.value },
    })
    if ('error' in res && res.error) {
      error.value
        = typeof res.error === 'string'
          ? res.error
          : res.error.message ?? 'Sign up failed'
      return false
    }
    username.value = ''
    password.value = ''
    await refreshMe()
    await refreshNuxtData(['cart-badge', 'cart-items'])
    return true
  }
  catch (e: unknown) {
    error.value = messageFromAuthFetchError(e)
    return false
  }
  finally {
    pending.value = false
  }
}

async function onSignOut() {
  pending.value = true
  try {
    await $fetch('/api/auth/sign-out', { method: 'POST' })
    await refreshMe()
    await refreshNuxtData(['cart-badge', 'cart-items'])
  }
  finally {
    pending.value = false
  }
}

async function signOutAndClose(close: () => void) {
  await onSignOut()
  close()
}

async function signInAndClose(close: () => void) {
  if (await onSignIn())
    close()
}

async function signUpAndClose(close: () => void) {
  if (await onSignUp())
    close()
}
</script>

<template>
  <div>
    <template v-if="me">
      <AppPopover v-if="!compact">
        <template #trigger>
          <button
            type="button"
            class="flex flex-row items-center gap-1 font-sans text-sm hover:underline"
          >
            {{ me.username }}
            <svg viewBox="0 0 10 6" class="h-[6px] w-[10px]">
              <polygon points="0,0 5,6 10,0" />
            </svg>
          </button>
        </template>
        <template #default="{ close }">
          <div class="flex flex-col items-center gap-2">
            <LazyUiButton
              variant="outline"
              size="sm"
              :disabled="pending"
              @click="signOutAndClose(close)"
            >
              Sign out
            </LazyUiButton>
          </div>
        </template>
      </AppPopover>
      <div v-else class="flex flex-col gap-2">
        <p class="text-sm font-semibold text-accent1">
          Signed in as {{ me.username }}
        </p>
        <LazyUiButton variant="outline" size="sm" :disabled="pending" @click="onSignOut">
          Sign out
        </LazyUiButton>
      </div>
    </template>

    <template v-else-if="compact">
      <div class="flex flex-col gap-3">
        <LazyUiInput v-model="username" placeholder="Username" />
        <LazyUiInput v-model="password" type="password" placeholder="Password" />
        <div class="flex flex-wrap gap-2">
          <LazyUiButton size="sm" :disabled="pending" @click="onSignIn">
            Log in
          </LazyUiButton>
          <LazyUiButton variant="outline" size="sm" :disabled="pending" @click="onSignUp">
            Create login
          </LazyUiButton>
        </div>
        <p v-if="error" class="text-sm text-red-500">
          {{ error }}
        </p>
      </div>
    </template>

    <AppPopover v-else>
      <template #trigger>
        <button
          type="button"
          class="flex flex-row items-center gap-1 font-sans text-sm hover:underline"
        >
          Log in
          <svg viewBox="0 0 10 6" class="h-[6px] w-[10px]">
            <polygon points="0,0 5,6 10,0" />
          </svg>
        </button>
      </template>
      <template #default="{ close }">
        <span class="text-sm font-semibold text-accent1">Log in</span>
        <form class="mt-3 flex flex-col gap-3" @submit.prevent>
          <LazyUiInput v-model="username" placeholder="Username" />
          <LazyUiInput v-model="password" type="password" placeholder="Password" />
          <div class="flex flex-col gap-2">
            <LazyUiButton
              type="button"
              :disabled="pending"
              @click="signInAndClose(close)"
            >
              Log in
            </LazyUiButton>
            <LazyUiButton
              type="button"
              variant="outline"
              :disabled="pending"
              @click="signUpAndClose(close)"
            >
              Create login
            </LazyUiButton>
          </div>
          <p v-if="error" class="text-sm text-red-500">
            {{ error }}
          </p>
        </form>
      </template>
    </AppPopover>
  </div>
</template>
