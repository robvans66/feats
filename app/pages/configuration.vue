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

      <div class="grid gap-4 mt-8 lg:grid-cols-2">
        <div class="fts-cfg-options">
          <label class="block font-semibold mb-2">Theme</label>
          <select v-model="themeMode" class="border px-2 py-1 w-full">
            <option value="system">Follow system (default)</option>
            <option value="light">Light Mode</option>
            <option value="dark">Dark Mode</option>
          </select>
        </div>
      </div>

      <div class="fts-cfg-options-buttons flex justify-end gap-3 mt-6">
        <button class="fts px-3 py-1" :disabled="saving" @click="saveConfig">Save Configuration</button>
        <button class="fts-cfg-reset-button border px-3 py-1" type="button" :disabled="saving" @click="showResetConfirm = true">Reset to Defaults</button>
      </div>
    </div>

    <div class="fts-cfg-options flex gap-3 mt-6">
        <button class="fts px-3 py-1" :disabled="saving || backingUp" @click="backupData">Backup Data</button>
        <span class="px-3 py-1">Make a backup of your data. This will download a SQL file containing all your rides and routes</span>
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

type ThemeMode = 'system' | 'light' | 'dark'

const backingUp = ref(false)
const bikeOptions = ref<string[]>([])
const surfaceOptions = ref<string[]>([])
const pageSizeOptions = ref<number[]>([])
const ridesColumnVisibility = ref<Record<string, boolean>>({})
const routesColumnVisibility = ref<Record<string, boolean>>({})
const themeMode = ref<ThemeMode>('system')
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
  { key: 'start', label: 'Start' },
  { key: 'destination', label: 'Destination' },
  { key: 'grade', label: 'Grade' },
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
    routesColumnVisibility: initVisibility(routesColumns, undefined),
    themeMode: 'system' as ThemeMode
  }
}

function broadcastConfig(config: {
  bikeOptions: string[]
  surfaceOptions: string[]
  pageSizeOptions: number[]
  ridesColumnVisibility: Record<string, boolean>
  routesColumnVisibility: Record<string, boolean>
  themeMode: ThemeMode
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
    themeMode.value = config?.themeMode ?? defaults.themeMode
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
    routesColumnVisibility: routesColumnVisibility.value,
    themeMode: themeMode.value
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
  themeMode.value = defaults.themeMode
  saveConfig()
}

async function backupData() {
  backingUp.value = true
  try {
    const ridesRes = await $fetch('/api/rides?pageSize=10000&page=0')
    const rides = ridesRes.rows || []

    const routesRes = await $fetch('/api/routes?pageSize=10000&page=0')
    const routes = routesRes.rows || []

    const configData = await $fetch('/api/config').catch(() => null)

    let sqlContent = '-- Feats Backup\n'
    sqlContent += `-- Generated: ${new Date().toISOString()}\n\n`
    
    sqlContent += '-- Rides Table\n'
    sqlContent += 'DROP TABLE IF EXISTS rides_table;\n'
    sqlContent += 'CREATE TABLE rides_table (\n'
    sqlContent += '  id INTEGER PRIMARY KEY,\n'
    sqlContent += '  date TEXT,\n'
    sqlContent += '  description TEXT,\n'
    sqlContent += '  distance REAL,\n'
    sqlContent += '  average REAL,\n'
    sqlContent += '  grade TEXT,\n'
    sqlContent += '  bike TEXT,\n'
    sqlContent += '  reference TEXT,\n'
    sqlContent += '  link TEXT,\n'
    sqlContent += '  notes TEXT\n'
    sqlContent += ');\n\n'
    
    if (rides && rides.length > 0) {
      for (const ride of rides) {
        const values = [
          ride.id || 'NULL',
          sqlEscape(ride.date),
          sqlEscape(ride.description),
          ride.distance || 'NULL',
          ride.average || 'NULL',
          sqlEscape(ride.grade),
          sqlEscape(ride.bike),
          sqlEscape(ride.reference),
          sqlEscape(ride.link),
          sqlEscape(ride.notes)
        ].join(', ')
        sqlContent += `INSERT INTO rides_table (id, date, description, distance, average, grade, bike, reference, link, notes) VALUES (${values});\n`
      }
      sqlContent += '\n'
    }
    
    sqlContent += '-- Routes Table\n'
    sqlContent += 'DROP TABLE IF EXISTS routes_table;\n'
    sqlContent += 'CREATE TABLE routes_table (\n'
    sqlContent += '  id INTEGER PRIMARY KEY,\n'
    sqlContent += '  description TEXT,\n'
    sqlContent += '  distance REAL,\n'
    sqlContent += '  grade TEXT,\n'
    sqlContent += '  start TEXT,\n'
    sqlContent += '  destination TEXT,\n'
    sqlContent += '  surface TEXT,\n'
    sqlContent += '  reference TEXT,\n'
    sqlContent += '  link TEXT,\n'
    sqlContent += '  notes TEXT\n'
    sqlContent += ');\n\n'
    
    if (routes && routes.length > 0) {
      for (const route of routes) {
        const values = [
          route.id || 'NULL',
          sqlEscape(route.description),
          route.distance || 'NULL',
          sqlEscape(route.grade),
          sqlEscape(route.start),
          sqlEscape(route.destination),
          sqlEscape(route.surface),
          sqlEscape(route.reference),
          sqlEscape(route.link),
          sqlEscape(route.notes)
        ].join(', ')
        sqlContent += `INSERT INTO routes_table (id, description, distance, grade, start, destination, surface, reference, link, notes) VALUES (${values});\n`
      }
      sqlContent += '\n'
    }
    
    sqlContent += '-- User Config Table\n'
    sqlContent += 'DROP TABLE IF EXISTS user_config;\n'
    sqlContent += 'CREATE TABLE user_config (\n'
    sqlContent += '  id INTEGER PRIMARY KEY,\n'
    sqlContent += '  bike_options TEXT NOT NULL,\n'
    sqlContent += '  surface_options TEXT NOT NULL,\n'
    sqlContent += '  page_size_options TEXT NOT NULL,\n'
    sqlContent += '  rides_column_visibility TEXT NOT NULL,\n'
    sqlContent += '  routes_column_visibility TEXT NOT NULL\n'
    sqlContent += ');\n\n'

    if (configData) {
      const bikeOptions = sqlEscape(JSON.stringify(configData.bikeOptions || []))
      const surfaceOptions = sqlEscape(JSON.stringify(configData.surfaceOptions || []))
      const pageSizeOptions = sqlEscape(JSON.stringify(configData.pageSizeOptions || []))
      const ridesColumnVisibility = sqlEscape(JSON.stringify(configData.ridesColumnVisibility || {}))
      const routesColumnVisibility = sqlEscape(JSON.stringify(configData.routesColumnVisibility || {}))
      sqlContent += `INSERT INTO user_config (id, bike_options, surface_options, page_size_options, rides_column_visibility, routes_column_visibility) VALUES (1, ${bikeOptions}, ${surfaceOptions}, ${pageSizeOptions}, ${ridesColumnVisibility}, ${routesColumnVisibility});\n\n`
    }

    const fileName = `feats-backup-${new Date().toISOString().split('T')[0]}.sql`
    const savedWithPicker = await saveBackupFile(sqlContent, fileName)
    showToast(savedWithPicker ? 'Backup saved successfully.' : 'Backup download started.')
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      showToast('Backup cancelled.')
      return
    }
    showToast('Failed to create backup.')
  } finally {
    backingUp.value = false
  }
}

async function saveBackupFile(content: string, fileName: string): Promise<boolean> {
  const windowWithPicker = window as Window & {
    showSaveFilePicker?: (options?: {
      suggestedName?: string
      types?: Array<{
        description?: string
        accept: Record<string, string[]>
      }>
    }) => Promise<{
      createWritable: () => Promise<{
        write: (data: string) => Promise<void>
        close: () => Promise<void>
      }>
    }>
  }

  if (typeof windowWithPicker.showSaveFilePicker === 'function') {
    const handle = await windowWithPicker.showSaveFilePicker({
      suggestedName: fileName,
      types: [
        {
          description: 'SQL file',
          accept: {
            'application/sql': ['.sql'],
            'text/plain': ['.sql']
          }
        }
      ]
    })
    const writable = await handle.createWritable()
    await writable.write(content)
    await writable.close()
    return true
  }

  const blob = new Blob([content], { type: 'application/sql' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
  return false
}

function sqlEscape(value: any): string {
  if (value === null || value === undefined || value === '') {
    return 'NULL'
  }
  return `'${String(value).replace(/'/g, "''")}'`
}

function showToast(message: string) {
  toast.value = message
  setTimeout(() => {
    toast.value = ''
  }, 2500)
}

onMounted(loadConfig)
</script>
