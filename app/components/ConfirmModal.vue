<template>
  <div v-if="show" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 p-4 rounded shadow max-w-md w-full">
      <h3 class="font-semibold mb-2 dark:text-white">{{ title }}</h3>
      <p class="mb-4 dark:text-gray-300">{{ message }}</p>
      <div class="flex justify-end space-x-2">
        <button @click="$emit('cancel')" class="px-3 py-1 border dark:border-gray-600 dark:text-white">Cancel</button>
        <button @click="$emit('confirm')" class="px-3 py-1 bg-red-600 text-white">Confirm</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({ show: Boolean, title: String, message: String })
</script>
