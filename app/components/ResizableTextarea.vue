<template>
  <div class="relative w-full">
    <textarea
      ref="textareaEl"
      :value="modelValue"
      @input="onInput"
      rows="1"
      class="border px-2 py-1 w-full resize-none overflow-y-auto block"
      :style="heightStyle"
    ></textarea>
    <div
      class="absolute bottom-0 right-0 w-4 h-4 cursor-ns-resize bg-gray-400 dark:bg-gray-500 hover:bg-gray-500 dark:hover:bg-gray-400"
      style="clip-path: polygon(100% 0, 100% 100%, 0 100%);"
      @mousedown="startDrag"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>()

const textareaEl = ref<HTMLTextAreaElement | null>(null)
const height = ref<number | null>(null)
let minHeight = 0
let startY = 0
let startHeight = 0

onMounted(() => {
  if (textareaEl.value) minHeight = textareaEl.value.offsetHeight
})

const heightStyle = computed(() => (height.value ? { height: `${height.value}px` } : {}))

function onInput(e: Event) {
  emit('update:modelValue', (e.target as HTMLTextAreaElement).value)
}

function startDrag(e: MouseEvent) {
  e.preventDefault()
  startY = e.clientY
  startHeight = height.value ?? minHeight
  window.addEventListener('mousemove', onDrag)
  window.addEventListener('mouseup', stopDrag)
}

function onDrag(e: MouseEvent) {
  height.value = Math.max(minHeight, startHeight + (e.clientY - startY))
}

function stopDrag() {
  window.removeEventListener('mousemove', onDrag)
  window.removeEventListener('mouseup', stopDrag)
}
</script>
