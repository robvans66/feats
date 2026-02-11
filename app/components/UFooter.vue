<template>
  <footer class="fts mt-8">
    <div class="max-w-6xl mx-auto px-4 py-4 text-l text-white/80 flex justify-between">
        <div>Feats v{{ version }} - keep track of your bicycle rides and planned routes</div>
        <div>
          <NuxtLink to="/configuration" class="text-white/90 hover:text-white hover:underline">Configuration</NuxtLink>
           <span class="mx-2">|</span>
          <NuxtLink to="/about" class="text-white/90 hover:text-white hover:underline">About</NuxtLink>
        </div>
      </div>
  </footer>
</template>

<script setup lang="ts">
const runtimeConfig = useRuntimeConfig()
const version = runtimeConfig.public.appVersion || '0.0.0'
</script>
