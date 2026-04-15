<template>
  <footer
    class="fixed bottom-0 flex h-12 w-screen flex-col items-center justify-between space-y-2 border-t border-gray-400 bg-background px-4 font-sans text-[11px] sm:h-6 sm:flex-row sm:space-y-0"
  >
    <div class="flex flex-wrap justify-center space-x-2 pt-2 sm:justify-start">
      <NuxtLink to="/" class="hover:bg-accent2 hover:underline">
        Home
      </NuxtLink>
      <span>|</span>
      <span role="link" aria-disabled="true" class="text-muted-foreground">
        FAQ
      </span>
      <span>|</span>
      <span role="link" aria-disabled="true" class="text-muted-foreground">
        Returns
      </span>
      <span>|</span>
      <span role="link" aria-disabled="true" class="text-muted-foreground">
        Careers
      </span>
      <span>|</span>
      <span role="link" aria-disabled="true" class="text-muted-foreground">
        Contact
      </span>
    </div>
    <div class="text-center sm:text-right">
      By using this website, you agree to check out the
      <a
        href="https://github.com/dan-hale/NuxtFaster"
        class="font-bold text-accent1 hover:underline"
        target="_blank"
        rel="noopener noreferrer"
      >Source Code</a>
    </div>
  </footer>
</template>
