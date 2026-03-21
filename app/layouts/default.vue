<template>
  <div class="min-h-screen flex flex-col">
    <UMain>
      <slot />
    </UMain>
    <UFooter /> <!-- obsolete in electron -->
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import { navigateTo } from '#app'

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

  const electron = (window as any).electron

  if (electron?.onMenuRides) {
    electron.onMenuRides(() => {
      navigateTo('/')
    })
  }
  if (electron?.onMenuRoutes) {
    electron.onMenuRoutes(() => {
      navigateTo('/routes')
    })
  }
  if (electron?.onMenuStatistics) {
    electron.onMenuStatistics(() => {
      navigateTo('/statistics')
    })
  }
  if (electron?.onMenuDocumentation) {
    electron.onMenuDocumentation(() => {
      navigateTo('/about')
    })
  }
  if (electron?.onMenuSettings) {
    electron.onMenuSettings(() => {
      navigateTo('/configuration')
    })
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('user-config-updated', handleConfigUpdated)
  mediaQuery?.removeEventListener('change', handleSystemChange)
})
</script>
