<template>
  <main class="flex-1 px-4 py-6" :class="isFullWidth ? 'max-w-full' : 'max-w-6xl mx-auto'">
    <slot />
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isFullWidth = computed(() => route.path === '/statistics')
</script>
