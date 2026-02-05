<template>
  <transition name="toast">
    <div v-if="msg" class="fixed bottom-6 right-6 bg-gray-900 text-white px-4 py-2 rounded shadow z-50">
      {{ msg }}
    </div>
  </transition>
</template>

<script setup lang="ts">
import { toRefs, computed } from 'vue'
const props = defineProps<{ message: string }>()
const { message } = toRefs(props)
const msg = computed(() => message.value)
</script>
