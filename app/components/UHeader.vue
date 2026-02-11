<template>
  <header class="fts shadow">
    <div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <NuxtLink to="/" class="text-5xl font-semibold text-white hover:text-white">feats</NuxtLink>
          <div v-if="loading" class="text-sm text-white/80 flex items-center">Loading <span class="ml-2 animate-spin">⟳</span></div>
        </div>
      <nav class="flex items-center space-x-4">
        <NuxtLink to="/" class="text-xl text-white/90 hover:text-white">Rides</NuxtLink>
        <NuxtLink to="/routes" class="text-xl text-white/90 hover:text-white">Routes</NuxtLink>
        <NuxtLink to="/statistics" class="text-xl text-white/90 hover:text-white">Statistics</NuxtLink>
        <NuxtLink to="/about" class="text-xl text-white/90 hover:text-white" aria-label="About" title="About">
          <UIcon name="flowbite:info-circle-outline" class="text-2xl relative top-[4px]" />
        </NuxtLink>
        <NuxtLink to="/configuration" class="text-xl text-white/90 hover:text-white" aria-label="Configuration" title="Configuration">
          <UIcon name="flowbite:cog-outline" class="text-2xl relative top-[4px]" />
        </NuxtLink>
        <button 
          @click="toggleDarkMode" 
          class="text-xl text-white/90 hover:text-white ml-2" 
          aria-label="Toggle dark mode"
          title="Toggle dark mode"
        >
          <UIcon v-if="isDark" name="flowbite:sun-outline" class="text-2xl relative top-[4px]" />
          <UIcon v-else name="flowbite:moon-outline" class="text-2xl relative top-[4px]" />
        </button>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useGlobalLoading } from '../composables/useGlobalLoading'

const { loading } = useGlobalLoading()
const isDark = ref(false)

function toggleDarkMode() {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  
  isDark.value = savedTheme === 'dark' || (!savedTheme && prefersDark)
  
  if (isDark.value) {
    document.documentElement.classList.add('dark')
  }
})
</script>