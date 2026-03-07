<template>
  <div class="min-h-screen flex flex-col">
    <UHeader />
    <UMain>
      <slot />
    </UMain>
    <UFooter /> <!-- obsolete in electron -->
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { navigateTo } from '#app'

onMounted(() => {
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
})</script>
