<template>
  <header class="fts shadow">
    <div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <!-- <NuxtLink to="/" class="fts-brandname text-5xl font-semibold text-white hover:text-white">feats</NuxtLink> -->
          <div v-if="loading" class="text-sm text-white/80 flex items-center">Loading <span class="ml-2 animate-spin">⟳</span></div>
        </div>
      <nav class="flex items-center space-x-4">
        <NuxtLink to="/" class="text-xl text-white/90 hover:text-white">Rides</NuxtLink>
        <NuxtLink to="/routes" class="text-xl text-white/90 hover:text-white">Routes</NuxtLink>
        <NuxtLink to="/statistics" class="text-xl text-white/90 hover:text-white">Statistics</NuxtLink>
        <!-- <NuxtLink to="/about" class="text-xl text-white/90 hover:text-white" aria-label="About" title="About">
          <UIcon name="flowbite:info-circle-outline" class="text-2xl relative top-[4px]" />
        </NuxtLink>
        <NuxtLink to="/configuration" class="text-xl text-white/90 hover:text-white" aria-label="Configuration" title="Configuration">
          <UIcon name="flowbite:cog-outline" class="text-2xl relative top-[4px]" />
        </NuxtLink> -->
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useGlobalLoading } from '../composables/useGlobalLoading'

const { loading } = useGlobalLoading()

type ThemeMode = 'system' | 'light' | 'dark'

function getConfig(): { themeMode?: ThemeMode } {
  try {
    return JSON.parse(localStorage.getItem('user_config') || '{}')
  } catch {
    return {}
  }
}

function applyTheme(mode: ThemeMode) {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const shouldBeDark = mode === 'dark' || (mode === 'system' && prefersDark)
  document.documentElement.classList.toggle('dark', shouldBeDark)
}

function handleConfigUpdated(e: Event) {
  const detail = (e as CustomEvent).detail as { themeMode?: ThemeMode }
  applyTheme(detail?.themeMode || 'system')
}

let mediaQuery: MediaQueryList | null = null
function handleSystemChange() {
  const mode = getConfig().themeMode || 'system'
  if (mode === 'system') applyTheme('system')
}

onMounted(() => {
  const mode = getConfig().themeMode || 'system'
  applyTheme(mode)

  window.addEventListener('user-config-updated', handleConfigUpdated)

  mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQuery.addEventListener('change', handleSystemChange)
})

onBeforeUnmount(() => {
  window.removeEventListener('user-config-updated', handleConfigUpdated)
  mediaQuery?.removeEventListener('change', handleSystemChange)
})
</script>