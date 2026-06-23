<template>
  <section class="fts">
    <h1 class="text-2xl pt-8 font-semibold ml-7 mb-4">Manage Data</h1>

    <!-- Backup Data -->
    <div class="fts-cfg-options mt-3 mb-4">
      <h2 class="text-lg font-semibold mb-1">Backup Data</h2>
      <p class="text-sm mb-4">Download a SQL file containing all your rides, routes and settings.</p>
      <button class="fts px-3 py-1" :disabled="backingUp" @click="backupData">
        {{ backingUp ? 'Creating backup…' : 'Backup Data' }}
      </button>
    </div>

    <!-- Restore Data -->
    <div class="fts-cfg-options mt-3 mb-4">
      <h2 class="text-lg font-semibold mb-1">Restore Data</h2>
      <p class="text-sm mb-4">Replace <strong>all</strong> data with the contents of a previously created backup (.sql file).</p>
      <input ref="restoreFileInput" type="file" accept=".sql" class="hidden" @change="handleRestoreFileSelect" />
      <button class="fts px-3 py-1" :disabled="restoring" @click="restoreFileInput?.click()">
        {{ restoring ? 'Restoring…' : 'Select backup file…' }}
      </button>
    </div>

    <ConfirmModal
      :show="showRestoreConfirm"
      title="Restore Data"
      :message="`This will permanently replace ALL your current data with the contents of '${pendingFileName}'. This cannot be undone. Are you sure?`"
      @confirm="confirmRestore"
      @cancel="cancelRestore"
    />

    <!-- Error modal -->
    <div v-if="restoreError" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 p-4 rounded shadow max-w-md w-full">
        <h3 class="font-semibold mb-2 text-red-600">Restore Failed</h3>
        <p class="mb-2 dark:text-gray-300">The file <strong>{{ restoreErrorFileName }}</strong> is invalid and cannot be restored.</p>
        <p class="mb-4 dark:text-gray-300">{{ restoreError }}</p>
        <div class="flex justify-end">
          <button class="confirm-modal-btn px-3 py-1 border dark:border-gray-600 dark:text-white" @click="restoreError = ''; restoreErrorFileName = ''">OK</button>
        </div>
      </div>
    </div>

    <!-- Import Data -->
    <div class="fts-cfg-options mt-3 mb-4">
      <h2 class="text-lg font-semibold mb-1">Import Data</h2>
      <p class="text-sm mb-4">Add rides or routes from a CSV file. The file must be named <code>rides_table.csv</code> or <code>routes_table.csv</code>.</p>
      <input ref="importFileInput" type="file" accept=".csv" class="hidden" @change="handleImportFileSelect" />
      <button class="fts px-3 py-1" :disabled="importing" @click="importFileInput?.click()">
        {{ importing ? 'Importing…' : 'Select CSV file…' }}
      </button>
    </div>

    <ConfirmModal
      :show="showImportConfirm"
      :title="`Import ${pendingImportTable === 'rides_table' ? 'Rides' : 'Routes'}`"
      :message="`This will add ${pendingImportRows.length} ${pendingImportTable === 'rides_table' ? 'ride' : 'route'}${pendingImportRows.length !== 1 ? 's' : ''} from '${pendingImportFileName}' to your existing data. Are you sure?`"
      @confirm="confirmImport"
      @cancel="cancelImport"
    />

    <!-- Import error modal -->
    <div v-if="importError" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 p-4 rounded shadow max-w-md w-full">
        <h3 class="font-semibold mb-2 text-red-600">Import Failed</h3>
        <p class="mb-2 dark:text-gray-300">The file <strong>{{ importErrorFileName }}</strong> is invalid and cannot be imported.</p>
        <p class="mb-4 dark:text-gray-300">{{ importError }}</p>
        <div class="flex justify-end">
          <button class="confirm-modal-btn px-3 py-1 border dark:border-gray-600 dark:text-white" @click="importError = ''; importErrorFileName = ''">OK</button>
        </div>
      </div>
    </div>

    <Toast :message="toast" />
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { $fetch } from 'ofetch'

const backingUp = ref(false)
const restoring = ref(false)
const showRestoreConfirm = ref(false)
const pendingSql = ref('')
const pendingFileName = ref('')
const restoreFileInput = ref<HTMLInputElement | null>(null)
const restoreError = ref('')
const restoreErrorFileName = ref('')
const importing = ref(false)
const showImportConfirm = ref(false)
const pendingImportTable = ref('')
const pendingImportRows = ref<any[]>([])
const pendingImportFileName = ref('')
const importFileInput = ref<HTMLInputElement | null>(null)
const importError = ref('')
const importErrorFileName = ref('')
const toast = ref('')

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

    if (rides.length > 0) {
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

    if (routes.length > 0) {
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
      const bikeOpts = sqlEscape(JSON.stringify(configData.bikeOptions || []))
      const surfaceOpts = sqlEscape(JSON.stringify(configData.surfaceOptions || []))
      const pageSizeOpts = sqlEscape(JSON.stringify(configData.pageSizeOptions || []))
      const ridesColVis = sqlEscape(JSON.stringify(configData.ridesColumnVisibility || {}))
      const routesColVis = sqlEscape(JSON.stringify(configData.routesColumnVisibility || {}))
      sqlContent += `INSERT INTO user_config (id, bike_options, surface_options, page_size_options, rides_column_visibility, routes_column_visibility) VALUES (1, ${bikeOpts}, ${surfaceOpts}, ${pageSizeOpts}, ${ridesColVis}, ${routesColVis});\n\n`
    }

    const fileName = `feats-backup-${new Date().toISOString().split('T')[0]}.sql`
    const savedWithPicker = await saveBackupFile(sqlContent, fileName)
    localStorage.setItem('feats_last_backup_at', new Date().toISOString())
    window.dispatchEvent(new Event('backup-updated'))
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
  if (typeof window !== 'undefined' && typeof window.showSaveFilePicker === 'function') {
    const handle = await window.showSaveFilePicker({
      suggestedName: fileName,
      types: [{ description: 'SQL file', accept: { 'application/sql': ['.sql'], 'text/plain': ['.sql'] } }]
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
  if (value === null || value === undefined || value === '') return 'NULL'
  return `'${String(value).replace(/'/g, "''")}'`
}

function validateBackupSql(sql: string): string | null {
  const firstLine = sql.split('\n').find(l => l.trim())
  if (!firstLine?.trim().startsWith('-- Feats Backup')) {
    return 'Not a valid Feats backup file (missing header).'
  }
  const lower = sql.toLowerCase()
  for (const table of ['rides_table', 'routes_table', 'user_config']) {
    if (!lower.includes(`create table ${table}`)) {
      return `Not a valid Feats backup file (missing table: ${table}).`
    }
  }
  if (/\battach\b/i.test(sql)) {
    return 'File contains a disallowed SQL command.'
  }
  const dropPattern = /DROP\s+TABLE\s+(?:IF\s+EXISTS\s+)?(\w+)/gi
  const allowed = new Set(['rides_table', 'routes_table', 'user_config'])
  let match
  while ((match = dropPattern.exec(sql)) !== null) {
    if (!allowed.has(match[1].toLowerCase())) {
      return `File attempts to drop an unexpected table: ${match[1]}.`
    }
  }
  return null
}

function handleRestoreFileSelect(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  if (!file.name.endsWith('.sql')) {
    showToast('Please select a .sql file.')
    return
  }
  const reader = new FileReader()
  reader.onload = (e) => {
    const sql = e.target?.result as string
    const error = validateBackupSql(sql)
    if (error) {
      restoreErrorFileName.value = file.name
      restoreError.value = error
      return
    }
    pendingSql.value = sql
    pendingFileName.value = file.name
    showRestoreConfirm.value = true
  }
  reader.readAsText(file)
  // reset so the same file can be re-selected if needed
  ;(event.target as HTMLInputElement).value = ''
}

async function confirmRestore() {
  showRestoreConfirm.value = false
  restoring.value = true
  const fileName = pendingFileName.value
  try {
    await $fetch('/api/restore', { method: 'POST', body: { sql: pendingSql.value } })
    showToast('Data restored successfully.')
  } catch (err: any) {
    restoreErrorFileName.value = fileName
    restoreError.value = err?.data?.statusMessage || err?.message || 'Restore failed.'
  } finally {
    restoring.value = false
    pendingSql.value = ''
    pendingFileName.value = ''
  }
}

function cancelRestore() {
  showRestoreConfirm.value = false
  pendingSql.value = ''
  pendingFileName.value = ''
}

const RIDES_HEADERS = ['id', 'date', 'description', 'distance', 'average', 'grade', 'bike', 'reference', 'link', 'notes']
const ROUTES_HEADERS = ['id', 'description', 'distance', 'grade', 'start', 'destination', 'surface', 'reference', 'link', 'notes']

function detectDelimiter(firstLine: string): string {
  const counts: Record<string, number> = { ',': 0, ';': 0, '\t': 0 }
  let inQuotes = false
  for (const ch of firstLine) {
    if (ch === '"') { inQuotes = !inQuotes; continue }
    if (!inQuotes && ch in counts) counts[ch]++
  }
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]
}

function parseCsv(text: string): string[][] {
  const rows: string[][] = []
  const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n')
  const nonEmpty = lines.filter(l => l.trim())
  if (nonEmpty.length === 0) return rows
  const delimiter = detectDelimiter(nonEmpty[0])
  for (const line of nonEmpty) {
    const fields: string[] = []
    let current = ''
    let inQuotes = false
    for (let i = 0; i < line.length; i++) {
      const ch = line[i]
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') { current += '"'; i++ }
        else inQuotes = !inQuotes
      } else if (ch === delimiter && !inQuotes) {
        fields.push(current); current = ''
      } else {
        current += ch
      }
    }
    fields.push(current)
    rows.push(fields)
  }
  return rows
}

function toNum(v: string): number | null {
  const s = v.trim()
  if (!s || s.toUpperCase() === 'NULL') return null
  const n = parseFloat(s)
  return isNaN(n) ? null : n
}

function toStr(v: string): string | null {
  const s = v.trim()
  return (!s || s.toUpperCase() === 'NULL') ? null : s
}

function validateAndParseImport(fileName: string, text: string): { table: string, rows: any[], error?: string } {
  const table = fileName === 'rides_table.csv' ? 'rides_table'
    : fileName === 'routes_table.csv' ? 'routes_table'
    : null

  if (!table) {
    return { table: '', rows: [], error: "File name must be 'rides_table.csv' or 'routes_table.csv'." }
  }

  const allRows = parseCsv(text)
  if (allRows.length < 2) {
    return { table, rows: [], error: 'The file contains no data rows.' }
  }

  const expectedHeaders = table === 'rides_table' ? RIDES_HEADERS : ROUTES_HEADERS
  const actualHeaders = allRows[0].map(h => h.trim().toLowerCase())

  if (actualHeaders.length !== expectedHeaders.length) {
    return { table, rows: [], error: `Expected ${expectedHeaders.length} columns, found ${actualHeaders.length}.` }
  }
  for (let i = 0; i < expectedHeaders.length; i++) {
    if (actualHeaders[i] !== expectedHeaders[i]) {
      return { table, rows: [], error: `Column ${i + 1}: expected '${expectedHeaders[i]}', found '${actualHeaders[i]}'.` }
    }
  }

  const rows: any[] = []
  for (let i = 0; i < allRows.length - 1; i++) {
    const fields = allRows[i + 1]
    const rowNum = i + 2
    if (fields.length !== expectedHeaders.length) {
      return { table, rows: [], error: `Row ${rowNum}: expected ${expectedHeaders.length} values, found ${fields.length}.` }
    }

    if (table === 'rides_table') {
      const date = toStr(fields[1])
      const description = toStr(fields[2])
      const distance = toNum(fields[3])
      const bike = toStr(fields[6])
      if (!date)            return { table, rows: [], error: `Row ${rowNum}: date is required.` }
      if (!description)     return { table, rows: [], error: `Row ${rowNum}: description is required.` }
      if (distance === null) return { table, rows: [], error: `Row ${rowNum}: distance is required and must be a number.` }
      if (!bike)            return { table, rows: [], error: `Row ${rowNum}: bike is required.` }
      rows.push({ date, description, distance, average: toNum(fields[4]), grade: toNum(fields[5]), bike, reference: toStr(fields[7]), link: toStr(fields[8]), notes: toStr(fields[9]) })
    } else {
      const description = toStr(fields[1])
      const distance = toNum(fields[2])
      const start = toStr(fields[4])
      const destination = toStr(fields[5])
      const surface = toStr(fields[6])
      if (!description)     return { table, rows: [], error: `Row ${rowNum}: description is required.` }
      if (distance === null) return { table, rows: [], error: `Row ${rowNum}: distance is required and must be a number.` }
      if (!start)           return { table, rows: [], error: `Row ${rowNum}: start is required.` }
      if (!destination)     return { table, rows: [], error: `Row ${rowNum}: destination is required.` }
      if (!surface)         return { table, rows: [], error: `Row ${rowNum}: surface is required.` }
      rows.push({ description, distance, grade: toNum(fields[3]), start, destination, surface, reference: toStr(fields[7]), link: toStr(fields[8]), notes: toStr(fields[9]) })
    }
  }

  return { table, rows }
}

function handleImportFileSelect(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (e) => {
    const result = validateAndParseImport(file.name, e.target?.result as string)
    if (result.error) {
      importErrorFileName.value = file.name
      importError.value = result.error
    } else {
      pendingImportTable.value = result.table
      pendingImportRows.value = result.rows
      pendingImportFileName.value = file.name
      showImportConfirm.value = true
    }
  }
  reader.readAsText(file)
  ;(event.target as HTMLInputElement).value = ''
}

async function confirmImport() {
  showImportConfirm.value = false
  importing.value = true
  try {
    const res = await $fetch('/api/import', {
      method: 'POST',
      body: { table: pendingImportTable.value, rows: pendingImportRows.value }
    })
    const label = pendingImportTable.value === 'rides_table' ? 'ride' : 'route'
    showToast(`${res.count} ${label}${res.count !== 1 ? 's' : ''} imported successfully.`)
  } catch (err: any) {
    importErrorFileName.value = pendingImportFileName.value
    importError.value = err?.data?.statusMessage || err?.message || 'Import failed.'
  } finally {
    importing.value = false
    pendingImportTable.value = ''
    pendingImportRows.value = []
    pendingImportFileName.value = ''
  }
}

function cancelImport() {
  showImportConfirm.value = false
  pendingImportTable.value = ''
  pendingImportRows.value = []
  pendingImportFileName.value = ''
}

function showToast(message: string) {
  toast.value = message
  setTimeout(() => { toast.value = '' }, 2500)
}
</script>
