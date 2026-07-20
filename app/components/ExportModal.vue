<template>
  <div v-if="show" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 p-4 rounded shadow max-w-md w-full">
      <h3 class="font-semibold mb-2 dark:text-white">Export Data</h3>
      <p class="mb-4 dark:text-gray-300">Select which table(s) to export to a CSV file.</p>
      <div class="flex flex-col gap-2 mb-4">
        <label class="flex items-center gap-2 dark:text-gray-300">
          <input type="checkbox" v-model="ridesModel" />
          <span>Rides</span>
        </label>
        <label class="flex items-center gap-2 dark:text-gray-300">
          <input type="checkbox" v-model="routesModel" />
          <span>Routes</span>
        </label>
      </div>
      <div class="flex justify-end space-x-2">
        <button @click="$emit('cancel')" class="confirm-modal-btn px-3 py-1 border dark:border-gray-600 dark:text-white">Cancel</button>
        <button
          @click="$emit('confirm')"
          :disabled="!rides && !routes"
          class="fts px-3 py-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >Export</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({ show: Boolean, rides: Boolean, routes: Boolean })
const emit = defineEmits(['update:rides', 'update:routes', 'confirm', 'cancel'])

const ridesModel = computed({
  get: () => props.rides,
  set: (v: boolean) => emit('update:rides', v)
})
const routesModel = computed({
  get: () => props.routes,
  set: (v: boolean) => emit('update:routes', v)
})
</script>
