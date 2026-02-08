<template>
  <footer class="fts mt-8">
    <div class="max-w-6xl mx-auto px-4 py-4 text-l text-white/80 flex justify-between">
        <div>Feats - keep track of your bicycle rides and planned routes</div>
        <div>
          <NuxtLink to="/about" class="text-white/90 hover:text-white hover:underline">v{{ version }}</NuxtLink>
        </div>
      </div>
  </footer>
</template>

<script setup lang="ts">
const runtimeConfig = useRuntimeConfig()
const version = runtimeConfig.public.appVersion || '0.0.0'
</script>
