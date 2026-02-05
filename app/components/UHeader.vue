<template>
  <header class="bg-[#424242] text-white shadow">
    <div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="text-xl font-semibold">Feats</div>
          <div v-if="loading" class="text-sm text-white/80 flex items-center">Loading <span class="ml-2 animate-spin">⟳</span></div>
        </div>
      <nav class="space-x-4">
        <NuxtLink to="/" class="text-sm text-white/90 hover:text-white hover:underline">Rides</NuxtLink>
        <NuxtLink to="/routes" class="text-sm text-white/90 hover:text-white hover:underline">Routes</NuxtLink>
        <NuxtLink to="/statistics" class="text-sm text-white/90 hover:text-white hover:underline">Statistics</NuxtLink>
        <NuxtLink to="/about" class="text-sm text-white/90 hover:text-white hover:underline">About</NuxtLink>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useGlobalLoading } from '../composables/useGlobalLoading'

const { loading } = useGlobalLoading()
</script>
