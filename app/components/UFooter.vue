<template>
  <footer class="fts mt-auto sticky bottom-0 z-20 border-t border-white/20">
    <div class="px-4 py-1 text-xs text-white overflow-x-auto whitespace-nowrap text-center">
      Total Rides: {{ status.totalRides }} - Total Routes: {{ status.totalRoutes }} - Last Change: {{ formattedLastChange }} - Last Backup: {{ formattedLastBackup }}
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { $fetch } from 'ofetch'

type FooterStatus = {
  version: string
  totalRides: number
  totalRoutes: number
  lastChangeAt: string | null
}

const status = ref<FooterStatus>({
  version: '-',
  totalRides: 0,
  totalRoutes: 0,
  lastChangeAt: null
})

const lastBackupAt = ref<string | null>(null)

function formatDate(value: string | null): string {
  if (!value) return '-'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '-'
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return `${day}-${month}-${year}`
}

const formattedLastChange = computed(() => formatDate(status.value.lastChangeAt))
const formattedLastBackup = computed(() => formatDate(lastBackupAt.value))

function loadLastBackup() {
  if (typeof window === 'undefined') return
  lastBackupAt.value = localStorage.getItem('feats_last_backup_at')
}

function handleBackupUpdated() {
  loadLastBackup()
}

function handleDataUpdated() {
  loadStatus()
}

async function loadStatus() {
  try {
    const data = await $fetch<FooterStatus>('/api/status')
    status.value = data
  } catch {
    // Keep defaults when status cannot be loaded.
  }
}

onMounted(() => {
  loadLastBackup()
  loadStatus()
  window.addEventListener('backup-updated', handleBackupUpdated)
  window.addEventListener('data-updated', handleDataUpdated)
  window.addEventListener('focus', loadStatus)
})

onBeforeUnmount(() => {
  window.removeEventListener('backup-updated', handleBackupUpdated)
  window.removeEventListener('data-updated', handleDataUpdated)
  window.removeEventListener('focus', loadStatus)
})
</script>
