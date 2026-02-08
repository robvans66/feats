<template>
  <header class="fts shadow">
    <div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <NuxtLink to="/" class="text-5xl font-semibold text-white hover:text-white">feats</NuxtLink>
          <div v-if="loading" class="text-sm text-white/80 flex items-center">Loading <span class="ml-2 animate-spin">⟳</span></div>
        </div>
      <nav class="space-x-4">
        <NuxtLink to="/" class="text-xl text-white/90 hover:text-white">Rides</NuxtLink>
        <NuxtLink to="/routes" class="text-xl text-white/90 hover:text-white">Routes</NuxtLink>
        <NuxtLink to="/statistics" class="text-xl text-white/90 hover:text-white">Statistics</NuxtLink>
        <NuxtLink to="/about" class="text-xl text-white/90 hover:text-white">About</NuxtLink>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useGlobalLoading } from '../composables/useGlobalLoading'

const { loading } = useGlobalLoading()
</script>
