<template>

  <section class="fts">
    <h1 class="text-2xl pt-8 font-semibold ml-7 mb-4">Configuration</h1>

    <div class="fts p-4 mt-3 mb-6 border-color rounded">
      <div class="grid gap-4 lg:grid-cols-3">
        <div class="fts-cfg-options">
          <label class="block">Bike Options</label>
          <div class="flex items-center gap-2 mt-1">
            <input v-model="newBikeOption" type="text" class="border px-2 py-1 w-full" placeholder="Add bike" @keyup.enter="addBikeOption" />
            <button class="fts px-3 py-1" type="button" @click="addBikeOption">Add</button>
          </div>
          <div class="flex flex-wrap gap-2 mt-2">
            <span v-for="(option, index) in bikeOptions" :key="`${option}-${index}`" class="fts-option-item inline-flex items-center gap-2 px-2 py-1 border rounded">
              <span>{{ option }}</span>
              <button class="text-xs" type="button" @click="removeBikeOption(index)">x</button>
            </span>
          </div>
        </div>
        <div class="fts-cfg-options">
          <label class="block">Surface Options</label>
          <div class="flex items-center gap-2 mt-1">
            <input v-model="newSurfaceOption" type="text" class="border px-2 py-1 w-full" placeholder="Add surface" @keyup.enter="addSurfaceOption" />
            <button class="fts px-3 py-1" type="button" @click="addSurfaceOption">Add</button>
          </div>
          <div class="flex flex-wrap gap-2 mt-2">
            <span v-for="(option, index) in surfaceOptions" :key="`${option}-${index}`" class="fts-option-item inline-flex items-center gap-2 px-2 py-1 border rounded">
              <span>{{ option }}</span>
              <button class="text-xs" type="button" @click="removeSurfaceOption(index)">x</button>
            </span>
          </div>
        </div>
        <div class="fts-cfg-options">
          <label class="block">Page Size Options</label>
          <div class="flex items-center gap-2 mt-1">
            <input v-model="newPageSizeOption" type="number" min="1" step="1" class="border px-2 py-1 w-full" placeholder="Add size" @keyup.enter="addPageSizeOption" />
            <button class="fts px-3 py-1" type="button" @click="addPageSizeOption">Add</button>
          </div>
          <div class="flex flex-wrap gap-2 mt-2">
            <span v-for="(option, index) in pageSizeOptions" :key="`${option}-${index}`" class="fts-option-item inline-flex items-center gap-2 px-2 py-1 border rounded">
              <span>{{ option }}</span>
              <button class="text-xs" type="button" @click="removePageSizeOption(index)">x</button>
            </span>
          </div>
        </div>
      </div>
      <div class="grid gap-4 mt-8 lg:grid-cols-2">
        <div class="fts-cfg-options">
          <label class="block">Rides Columns</label>
          <div class="grid gap-2 mt-2 sm:grid-cols-2 p-3 rounded">
            <label v-for="col in ridesColumns" :key="col.key" class="flex items-center gap-2">
              <input type="checkbox" v-model="ridesColumnVisibility[col.key]" />
              <span>{{ col.label }}</span>
            </label>
          </div>
        </div>
        <div class="fts-cfg-options">
          <label class="block">Routes Columns</label>
          <div class="grid gap-2 mt-2 sm:grid-cols-2">
            <label v-for="col in routesColumns" :key="col.key" class="flex items-center gap-2">
              <input type="checkbox" v-model="routesColumnVisibility[col.key]" />
              <span>{{ col.label }}</span>
            </label>
          </div>
        </div>
      </div>
      <div class="fts-cfg-options-buttons flex justify-end gap-3 mt-6">
        <button class="fts px-3 py-1" :disabled="saving" @click="saveConfig">Save Configuration</button>
        <button class="fts-cfg-reset-button border px-3 py-1" type="button" :disabled="saving" @click="showResetConfirm = true">Reset to Defaults</button>
      </div>
    </div>

    <div class="fts-cfg-options flex gap-3 mt-6">
        <button class="fts px-3 py-1" :disabled="saving || backingUp" @click="backupData">Backup Data</button>
        <span class="px-3 py-1">Make a backup of your data. This will download a JSON file containing all your rides, routes, and configuration. Happy days.</span>
    </div>
    


    <ConfirmModal
      :show="showResetConfirm"
      title="Reset Configuration"
      message="Are you sure you want to reset configuration to defaults?"
      @confirm="confirmReset"
      @cancel="showResetConfirm = false"
    />
    <Toast :message="toast" />
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { $fetch } from 'ofetch'
const backingUp = ref(false)

const bikeOptions = ref<string[]>([])
const surfaceOptions = ref<string[]>([])
const pageSizeOptions = ref<number[]>([])
const ridesColumnVisibility = ref<Record<string, boolean>>({})
const routesColumnVisibility = ref<Record<string, boolean>>({})
const newBikeOption = ref('')
const newSurfaceOption = ref('')
const newPageSizeOption = ref('')
const saving = ref(false)
const toast = ref('')
const showResetConfirm = ref(false)

const ridesColumns = [
  { key: 'id', label: 'ID' },
  { key: 'date', label: 'Date' },
  { key: 'description', label: 'Description' },
  { key: 'distance', label: 'Distance' },
  { key: 'average', label: 'Average' },
  { key: 'grade', label: 'Grade' },
  { key: 'bike', label: 'Bike' },
  { key: 'reference', label: 'Reference' },
  { key: 'link', label: 'Link' },
  { key: 'notes', label: 'Notes' }
]

const routesColumns = [
  { key: 'id', label: 'ID' },
  { key: 'description', label: 'Description' },
  { key: 'distance', label: 'Distance' },
  { key: 'grade', label: 'Grade' },
  { key: 'start', label: 'Start' },
  { key: 'destination', label: 'Destination' },
  { key: 'surface', label: 'Surface' },
  { key: 'reference', label: 'Reference' },
  { key: 'link', label: 'Link' },
  { key: 'notes', label: 'Notes' }
]

function initVisibility(
  columns: { key: string }[],
  existing: Record<string, boolean> | undefined
) {
  const result: Record<string, boolean> = {}
  for (const col of columns) {
    result[col.key] = existing?.[col.key] ?? true
  }
  return result
}

function getDefaults() {
  return {
    bikeOptions: ['Santos', 'Rimonta', 'Gazelle', 'Wahoo'],
    surfaceOptions: ['Road', 'Gravel', 'Road/Gravel', 'Gravel/MTB'],
    pageSizeOptions: [5, 10, 20],
    ridesColumnVisibility: initVisibility(ridesColumns, undefined),
    routesColumnVisibility: initVisibility(routesColumns, undefined)
  }
}

function broadcastConfig(config: {
  bikeOptions: string[]
  surfaceOptions: string[]
  pageSizeOptions: number[]
  ridesColumnVisibility: Record<string, boolean>
  routesColumnVisibility: Record<string, boolean>
}) {
  if (typeof window === 'undefined') return
  localStorage.setItem('user_config', JSON.stringify(config))
  window.dispatchEvent(new CustomEvent('user-config-updated', { detail: config }))
}

function addUniqueString(list: string[], value: string) {
  const trimmed = value.trim()
  if (!trimmed || list.includes(trimmed)) return list
  return [...list, trimmed]
}

function addUniqueNumber(list: number[], value: number) {
  if (!Number.isFinite(value) || value <= 0 || list.includes(value)) return list
  return [...list, value]
}

function addBikeOption() {
  bikeOptions.value = addUniqueString(bikeOptions.value, newBikeOption.value)
  newBikeOption.value = ''
}

function addSurfaceOption() {
  surfaceOptions.value = addUniqueString(surfaceOptions.value, newSurfaceOption.value)
  newSurfaceOption.value = ''
}

function addPageSizeOption() {
  const value = Number(newPageSizeOption.value)
  pageSizeOptions.value = addUniqueNumber(pageSizeOptions.value, value)
  newPageSizeOption.value = ''
}

function removeBikeOption(index: number) {
  bikeOptions.value = bikeOptions.value.filter((_, idx) => idx !== index)
}

function removeSurfaceOption(index: number) {
  surfaceOptions.value = surfaceOptions.value.filter((_, idx) => idx !== index)
}

function removePageSizeOption(index: number) {
  pageSizeOptions.value = pageSizeOptions.value.filter((_, idx) => idx !== index)
}

async function loadConfig() {
  try {
    const config = await $fetch('/api/config')
    const defaults = getDefaults()
    bikeOptions.value = Array.isArray(config?.bikeOptions) ? config.bikeOptions : defaults.bikeOptions
    surfaceOptions.value = Array.isArray(config?.surfaceOptions) ? config.surfaceOptions : defaults.surfaceOptions
    pageSizeOptions.value = Array.isArray(config?.pageSizeOptions) ? config.pageSizeOptions : defaults.pageSizeOptions
    ridesColumnVisibility.value = initVisibility(ridesColumns, config?.ridesColumnVisibility)
    routesColumnVisibility.value = initVisibility(routesColumns, config?.routesColumnVisibility)
  } catch {
    showToast('Failed to load configuration.')
  }
}

async function saveConfig() {
  saving.value = true
  const payload = {
    bikeOptions: bikeOptions.value,
    surfaceOptions: surfaceOptions.value,
    pageSizeOptions: pageSizeOptions.value,
    ridesColumnVisibility: ridesColumnVisibility.value,
    routesColumnVisibility: routesColumnVisibility.value
  }
  try {
    await $fetch('/api/config', {
      method: 'PUT',
      body: payload
    })
    broadcastConfig(payload)
    showToast('Configuration saved.')
  } catch {
    showToast('Failed to save configuration.')
  } finally {
    saving.value = false
  }
}

function confirmReset() {
  showResetConfirm.value = false
  const defaults = getDefaults()
  bikeOptions.value = [...defaults.bikeOptions]
  surfaceOptions.value = [...defaults.surfaceOptions]
  pageSizeOptions.value = [...defaults.pageSizeOptions]
  ridesColumnVisibility.value = { ...defaults.ridesColumnVisibility }
  routesColumnVisibility.value = { ...defaults.routesColumnVisibility }
  saveConfig()
}

async function backupData() {
  backingUp.value = true
  try {
    // Fetch all rides with a large page size
    const ridesRes = await $fetch('/api/rides?pageSize=10000&page=0')
    const rides = ridesRes.data || ridesRes

    // Fetch all routes with a large page size
    const routesRes = await $fetch('/api/routes?pageSize=10000&page=0')
    const routes = routesRes.data || routesRes
    
    const userConfig = localStorage.getItem('user_config')
    
    const backup = {
      timestamp: new Date().toISOString(),
      rides_table: rides,
      routes_table: routes,
      user_config: userConfig ? JSON.parse(userConfig) : null
    }
    
    const jsonString = JSON.stringify(backup, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `feats-backup-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    showToast('Backup downloaded successfully.')
  } catch (error) {
    showToast('Failed to create backup.')
  } finally {
    backingUp.value = false
  }
}
function showToast(message: string) {
  toast.value = message
  setTimeout(() => {
    toast.value = ''
  }, 2500)
}

onMounted(loadConfig)
</script>
