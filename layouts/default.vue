<template>
  <div class="min-h-screen flex flex-col">
    <UHeader />
    <UMain>
      <slot />
    </UMain>
    <UFooter />
  </div>
</template>

<script setup lang="ts">
import UHeader from '~/components/UHeader.vue'
import UMain from '~/components/UMain.vue'
import UFooter from '~/components/UFooter.vue'
</script>
