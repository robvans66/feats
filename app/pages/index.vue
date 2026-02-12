<template>
  <section>
    <form @submit.prevent="onSubmit" class="fts p-6 mb-6 border-color rounded">
      <h1 class="text-3xl font-semibold mb-6">Add a Ride</h1>
      <div class="grid grid-cols-7 gap-4">
        <div class="col-span-1">
          <label class="block">Date*</label>
          <input v-model="form.date" type="date" required class="border px-2 py-1 w-full" />
        </div>
        <div class="col-span-2">
          <label class="block">Description*</label>
          <input v-model="form.description" type="text" required class="border px-2 py-1 w-full" />
        </div>
        <div class="col-span-1">
          <label class="block">Distance * (km)</label>
          <input v-model.number="form.distance" type="number" step="0.1" required class="border px-2 py-1 w-full" />
        </div>
        <div class="col-span-1">
          <label class="block">Average (km/h)</label>
          <input v-model.number="form.average" type="number" step="0.1" class="border px-2 py-1 w-full" />
        </div>
        <div class="col-span-1">
          <label class="block">Grade (%)</label>
          <input v-model.number="form.grade" type="number" step="0.1" class="border px-2 py-1 w-full" />
        </div>
        <div class="col-span-1">
          <label class="block">Bike*</label>
          <USelect v-model="form.bike" :items="bikeOptions" :ui="selectUi" class="w-full" variant="none" />
        </div>
        <div class="col-span-2">
          <label class="block">Reference</label>
          <input v-model="form.reference" type="text" class="border px-2 py-1 w-full" @input="onReferenceInput" />
        </div>
        <div class="col-span-1">
          <label class="block">Link</label>
          <input v-model="form.link" :disabled="!form.reference" type="text" class="border px-2 py-1 w-full" />
        </div>
        <div class="col-span-3">
          <label class="block">Notes</label>
          <input v-model="form.notes" type="text" class="border px-2 py-1 w-full" />
        </div>
        <div class="col-span-1 flex items-end space-x-2">
          <button type="submit" class="fts px-3 py-1" :disabled="loading">{{ isEditing ? 'Update' : 'Add' }}</button>
          <button type="button" @click="clearForm" class="fts px-3 py-1" :disabled="loading">Clear</button>
        </div>
      </div>
    </form>

    <ConfirmModal :show="showConfirm" title="Delete Ride" message="Are you sure you want to delete the selected ride?" @confirm="confirmDelete" @cancel="()=>showConfirm=false" />
    <Toast :message="toast" />


 <h1 class="text-3xl font-semibold mb-6 mt-10">Completed Rides</h1>
    <div class="flex items-center justify-between mt-4 mb-4">
      <div class="flex items-center space-x-2">
        <button class="px-3 py-1 fts disabled:opacity-50" :disabled="!selectedRow || loading" @click="onEdit">Edit</button>
        <button class="px-3 py-1 fts-delete disabled:opacity-50" :disabled="!selectedRow || loading" @click="onDelete">Delete</button>
      </div>
      <div class="flex items-center space-x-2">
          <input v-model="tableState.globalFilter" placeholder="Search" class="border px-2 py-1" />
          <USelect
            v-model="tableState.pagination.pageSize"
            :items="pageSizeOptions"
            :ui="selectUi"
            class="w-24"
            variant="none"
            @update:modelValue="(value) => setPageSize(value as number)"
          />
        <div class="relative z-20">
          <button @click="showCols = !showCols" class="border px-2 py-1">Columns ▾</button>
          <div v-if="showCols" class="absolute right-0 mt-2 bg-white border p-2 shadow z-30 w-max">
            <label v-for="c in allColumns" :key="c.key" class="block"><input type="checkbox" v-model="tableState.columnVisibility[c.key]" /> {{c.label}}</label>
          </div>
        </div>
      </div>
    </div>

    <div class="table-rides bg-white border overflow-x-auto relative">
      <Table :data="rows" :columns="tableColumns" :state="tableState" :selectedRowId="selectedRow?.id ?? null" :onStateChange="onStateChange" :onSelect="(e,row)=>handleTableSelect(e,row)" />
      <Spinner v-if="loading" />
    </div>

    <div class="flex items-center justify-between mt-3">
      <div>Showing {{start+1}} - {{end}} of {{total}}</div>
      <div class="space-x-2">
        <button @click="prevPage" :disabled="(tableState.pagination.pageIndex||0)===0" class="px-2 py-1 border">Prev</button>
        <button @click="nextPage" :disabled="((tableState.pagination.pageIndex||0)+1)*(tableState.pagination.pageSize||10) >= total" class="px-2 py-1 border">Next</button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch, h } from 'vue'
import { $fetch } from 'ofetch'
import { useGlobalLoading } from '../composables/useGlobalLoading'

  const allColumns = [
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

const bikeOptions = ref<string[]>(['Santos', 'Rimonta', 'Gazelle', 'Wahoo'])
const pageSizeOptions = ref<number[]>([5, 10, 20])

const rows = ref<any[]>([])
const total = ref(0)
const page = ref(0)
const search = ref('')
const sortBy = ref('date')
const sortDir = ref<'asc'|'desc'>('desc')
const selectedRow = ref<any | null>(null)
const isEditing = ref(false)
const showCols = ref(false)
// column visibility is stored in tableState.columnVisibility

const form = ref({ id: null, date: '', description: '', distance: null, average: null, grade: null, bike: 'Santos', reference: '', link: '', notes: '' })
const toast = ref('')
const showConfirm = ref(false)

const selectUi = {
  base: 'border border-[var(--fts-ui-primary)] bg-[var(--fts-ui-bg-input-form)] text-[var(--fts-ui-primary)] rounded-[4px] min-h-[34px] px-2 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--fts-ui-button)] focus-visible:ring-inset'
}

const defaultColumnVisibility = allColumns.reduce((acc, col) => {
  acc[col.key] = true
  return acc
}, {} as Record<string, boolean>)

// debounce handled by Table state; preserve previous localStorage if present

let loadTimeout: any = null
async function load(state?: any){
  const s = state || tableState.value
  const pageIndex = s.pagination?.pageIndex || 0
  const pageSize = s.pagination?.pageSize || 10
  const filter = s.globalFilter || ''
  const sort = (s.sorting && s.sorting[0]) || null
  const sortBy = sort?.id || 'date'
  const sortDir = sort?.desc ? 'desc' : 'asc'
  const params = new URLSearchParams({ page: String(pageIndex), pageSize: String(pageSize), filter: filter, sortBy, sortDir })
  setLoading(true)
  try {
    const res:any = await $fetch(`/api/rides?${params.toString()}`)
    rows.value = res.rows || []
    total.value = res.total || 0
  } catch (err:any) {
    toast.value = err?.message || 'Failed to load rides'
    setTimeout(()=> toast.value = '', 3000)
  } finally {
    setLoading(false)
  }
}

onMounted(async () => {
  const saved = localStorage.getItem('rides_column_visibility')
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      if (parsed) tableState.value.columnVisibility = parsed
    } catch {}
  }
  const savedSorting = localStorage.getItem('rides_sorting')
  if (savedSorting) {
    try {
      const parsed = JSON.parse(savedSorting)
      if (Array.isArray(parsed)) tableState.value.sorting = parsed
    } catch {}
  }
  try {
    const config = await $fetch('/api/config')
    applyConfig(config)
  } catch {}
  if (typeof window !== 'undefined') {
    window.addEventListener('user-config-updated', handleConfigEvent)
    window.addEventListener('storage', handleStorageEvent)
  }
  load()
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('user-config-updated', handleConfigEvent)
    window.removeEventListener('storage', handleStorageEvent)
  }
})

function applyConfig(config: any) {
  if (!config) return
  if (Array.isArray(config.bikeOptions) && config.bikeOptions.length) {
    bikeOptions.value = config.bikeOptions
  }
  if (Array.isArray(config.pageSizeOptions) && config.pageSizeOptions.length) {
    pageSizeOptions.value = config.pageSizeOptions
  }
  if (!bikeOptions.value.includes(form.value.bike)) {
    form.value.bike = bikeOptions.value[0] || ''
  }
  if (!pageSizeOptions.value.includes(tableState.value.pagination.pageSize || 10)) {
    tableState.value.pagination.pageSize = pageSizeOptions.value[0] || 10
    tableState.value.pagination.pageIndex = 0
  }
  if (config.ridesColumnVisibility) {
    tableState.value.columnVisibility = { ...defaultColumnVisibility, ...config.ridesColumnVisibility }
    localStorage.setItem('rides_column_visibility', JSON.stringify(tableState.value.columnVisibility))
  }
}

function handleConfigEvent(event: Event) {
  const detail = (event as CustomEvent).detail
  applyConfig(detail)
}

function handleStorageEvent(event: StorageEvent) {
  if (event.key !== 'user_config' || !event.newValue) return
  try {
    const config = JSON.parse(event.newValue)
    applyConfig(config)
  } catch {}
}

function fetchDebounced(state?: any){
  clearTimeout(loadTimeout)
  loadTimeout = setTimeout(()=> load(state), 200)
}

const { loading, setLoading, wrap } = useGlobalLoading()

  // Table-managed state (globalFilter, sorting, pagination)
  const tableState = ref({ globalFilter: '', sorting: [{ id: 'date', desc: true }], pagination: { pageIndex: 0, pageSize: 10 }, columnVisibility: defaultColumnVisibility })

  watch(() => tableState.value.columnVisibility, (v)=>{
    if (typeof window === 'undefined') return
    localStorage.setItem('rides_column_visibility', JSON.stringify(v))
  }, { deep: true })

  watch(() => tableState.value.sorting, (v) => {
    if (typeof window === 'undefined') return
    localStorage.setItem('rides_sorting', JSON.stringify(v || []))
  }, { deep: true })

watch(tableState, (v)=> fetchDebounced(v), { deep: true })

  const start = computed(()=> (tableState.value.pagination?.pageIndex || 0) * (tableState.value.pagination?.pageSize || 10))
  const end = computed(()=> Math.min(start.value + (tableState.value.pagination?.pageSize || 10), total.value))


const tableColumns = computed(() => [
  { accessorKey: 'id', headerLabel: 'ID', enableSorting: true },
  { accessorKey: 'date', headerLabel: 'Date', enableSorting: true },
  { accessorKey: 'description', headerLabel: 'Description', enableSorting: true },
  { accessorKey: 'distance', headerLabel: 'Distance', enableSorting: true },
  { accessorKey: 'average', headerLabel: 'Average', enableSorting: true },
  { accessorKey: 'grade', headerLabel: 'Grade' },
  { accessorKey: 'bike', headerLabel: 'Bike', enableSorting: true },
  { accessorKey: 'reference', headerLabel: 'Reference' },
  { accessorKey: 'link', headerLabel: 'Link', cell: (ctx: { getValue: () => any; row: { original: any } }) => {
      const value = ctx.getValue()
      if (ctx.row.original.reference) return h('a', { href: ctx.row.original.reference, target: '_blank', class: 'text-blue-600 hover:underline' }, value || 'Link')
      return value || ''
    }
  },
  { accessorKey: 'notes', headerLabel: 'Notes' }
])

function handleTableSelect(e:any, row:any){
  selectRow(row)
}

function onStateChange(updaterOrValue:any){
  tableState.value = typeof updaterOrValue === 'function' ? updaterOrValue(tableState.value) : updaterOrValue
}

function prevPage(){ if((tableState.value.pagination.pageIndex || 0) > 0) tableState.value.pagination.pageIndex-- }
function nextPage(){
  const pageIdx = tableState.value.pagination.pageIndex || 0
  const ps = tableState.value.pagination.pageSize || 10
  if ((pageIdx+1)*ps < total.value) tableState.value.pagination.pageIndex++
}

function setPageSize(n:number){ tableState.value.pagination.pageSize = n; tableState.value.pagination.pageIndex = 0 }

function selectRow(row:any){
  const rowId = row?.id ?? null
  const selectedId = selectedRow.value?.id ?? null
  selectedRow.value = rowId !== null && rowId === selectedId ? null : row
}

function onEdit(){
  if (!selectedRow.value) return
  isEditing.value = true
  const r = selectedRow.value
  form.value = { ...r }
  // focus first field
  nextTick(()=>{
    const el = document.querySelector('input[type=date]') as HTMLInputElement
    el?.focus()
  })
}

function onDelete(){
  if (!selectedRow.value) return
  showConfirm.value = true
}

async function confirmDelete(){
  if (!selectedRow.value) return
  await $fetch(`/api/rides?id=${selectedRow.value.id}`, { method: 'DELETE' })
  showConfirm.value = false
  toast.value = 'Ride deleted'
  setTimeout(()=> toast.value = '', 2500)
  selectedRow.value = null
  load()
}

function onReferenceInput(){
  if (!form.value.reference) form.value.link = ''
  else if (!form.value.link) form.value.link = 'Link'
}

function clearForm(){
  form.value = { id: null, date: '', description: '', distance: null, average: null, grade: null, bike: 'Santos', reference: '', link: '', notes: '' }
  isEditing.value = false
}

async function onSubmit(){
  if (isEditing.value){
    await $fetch('/api/rides', { method: 'PUT', body: form.value })
    isEditing.value = false
    selectedRow.value = null
    toast.value = 'Ride updated'
  } else {
    const body = { ...form.value }
    if (body.reference && !body.link) body.link = 'Link'
    await $fetch('/api/rides', { method: 'POST', body })
    toast.value = 'Ride added'
  }
  setTimeout(()=> toast.value = '', 2500)
  clearForm()
  load()
}

function sort(key:string){
  if (sortBy.value===key) sortDir.value = sortDir.value==='asc' ? 'desc' : 'asc'
  else { sortBy.value = key; sortDir.value = 'asc' }
}

function sortIndicator(key:string){
  if (sortBy.value !== key) return ''
  return sortDir.value === 'asc' ? '▲' : '▼'
}
</script>
