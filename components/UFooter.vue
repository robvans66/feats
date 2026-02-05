<template>
  <footer class="bg-white border-t mt-8">
    <div class="max-w-6xl mx-auto px-4 py-4 text-sm text-gray-600 flex justify-between">
        <div>Feats - keep track of your bicycle rides and planned routes</div>
        <div>
          <NuxtLink to="/about" class="hover:underline">v{{ version }}</NuxtLink>
        </div>
      </div>
  </footer>
</template>

  <script setup lang="ts">
  import pkg from '../../package.json'
  const version = pkg.version || '0.0.0'
  </script>
