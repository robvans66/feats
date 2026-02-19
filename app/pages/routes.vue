<template>
  <section>
    <form @submit.prevent="onSubmit" class="fts p-6 mb-6 border-color rounded">
      <h1 class="text-3xl font-semibold mb-6">Add a Route</h1>
      <div class="grid grid-cols-7 gap-4">
        <div class="col-span-2">
          <label class="block">Description*</label>
          <input v-model="form.description" type="text" required class="border px-2 py-1 w-full" />
        </div>
        <div class="col-span-1">
          <label class="block">Distance * (km)</label>
          <input v-model.number="form.distance" type="number" step="0.1" required class="border px-2 py-1 w-full" />
        </div>
        <div class="col-span-1">
          <label class="block">Start*</label>
          <input v-model="form.start" type="text" required class="border px-2 py-1 w-full" />
        </div>
        <div class="col-span-1">
          <label class="block">Destination*</label>
          <input v-model="form.destination" type="text" required class="border px-2 py-1 w-full" />
        </div>
                <div class="col-span-1">
          <label class="block">Grade (%)</label>
          <input v-model.number="form.grade" type="number" step="0.1" class="border px-2 py-1 w-full" />
        </div>
        <div class="col-span-1">
          <label class="block">Surface*</label>
          <USelect v-model="form.surface" :items="surfaceOptions" :ui="selectUi" class="w-full" variant="none" />
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
          <button type="submit" class="px-3 py-1 fts" :disabled="loading">{{ isEditing ? 'Update' : 'Add' }}</button>
          <button type="button" @click="clearForm" class="px-3 py-1 border fts" :disabled="loading">Clear</button>
        </div>
      </div>
    </form>

    <ConfirmModal :show="showConfirm" title="Delete Route" :message="`Are you sure you want to delete ${selectedRows.length} route${selectedRows.length > 1 ? 's' : ''}?`" @confirm="confirmDelete" @cancel="()=>showConfirm=false" />
    <Toast :message="toast" />

    <h1 class="text-3xl font-semibold mb-6 mt-10">Planned Routes</h1>
    <div class="flex items-center justify-between mt-4 mb-4">
      <div class="flex items-center space-x-2">
        <button class="px-3 py-1 fts disabled:opacity-50" :disabled="selectedRows.length !== 1 || loading" @click="onEdit">Edit</button>
        <button class="px-3 py-1 fts-delete disabled:opacity-50" :disabled="selectedRows.length === 0 || loading" @click="onDelete">Delete {{ selectedRows.length > 1 ? `(${selectedRows.length})` : '' }}</button>
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
          <div v-if="showCols" class="absolute right-0 mt-2 bg-white dark:bg-gray-800 border dark:border-gray-700 p-2 shadow z-30 w-max">
            <label v-for="c in allColumns" :key="c.key" class="block dark:text-white"><input type="checkbox" v-model="tableState.columnVisibility[c.key]" /> {{c.label}}</label>
          </div>
        </div>
      </div>
    </div>

    <div class="table-routes bg-white border overflow-x-auto relative">
      <Table 
        :data="rows" 
        :columns="tableColumns" 
        :state="tableState" 
        :multiSelect="true"
        :selectedRowIds="selectedRows"
        :onSelectionChange="handleSelectionChange"
        :onStateChange="onStateChange" 
        :onSelect="(e: MouseEvent, row: any)=>handleTableSelect(e,row)" 
      />
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

const surfaceOptions = ref<string[]>(['Road', 'Gravel', 'Road/Gravel', 'Gravel/MTB'])
const pageSizeOptions = ref<number[]>([5, 10, 20])

const rows = ref<any[]>([])
const total = ref(0)
const page = ref(0)
const search = ref('')
const sortBy = ref('distance')
const sortDir = ref<'asc'|'desc'>('desc')
const selectedRows = ref<number[]>([])
const isEditing = ref(false)
const showCols = ref(false)
const defaultVisibleColumns = allColumns.map(c => c.key)
const visibleColumns = ref(defaultVisibleColumns)

const form = ref({ id: null, description: '', distance: null, start: '', destination: '', grade: null, surface: 'Road', reference: '', link: '', notes: '' })
const toast = ref('')
const showConfirm = ref(false)

const selectUi = {
  base: 'border border-[var(--fts-ui-primary)] bg-[var(--fts-ui-bg-input-form)] text-[var(--fts-ui-primary)] rounded-[4px] min-h-[34px] px-2 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--fts-ui-button)] focus-visible:ring-inset'
}

// debounce search
let searchTimeout: any = null
watch(search, (v) => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(()=>{ page.value = 0 }, 300)
})

watch(visibleColumns, (v)=>{
  if (typeof window === 'undefined') return
  localStorage.setItem('routes_visible_columns', JSON.stringify(v))
}, { deep: true })

let loadTimeout: any = null
async function load(state?: any){
  const s = state || tableState.value
  const pageIndex = s.pagination?.pageIndex || 0
  const pageSize = s.pagination?.pageSize || 10
  const filter = s.globalFilter || ''
  const sort = (s.sorting && s.sorting[0]) || null
  const sortBy = sort?.id || 'distance'
  const sortDir = sort?.desc ? 'desc' : 'asc'
  const params = new URLSearchParams({ page: String(pageIndex), pageSize: String(pageSize), filter: filter, sortBy, sortDir })
  setLoading(true)
  try {
    const res:any = await $fetch(`/api/routes?${params.toString()}`)
    rows.value = res.rows || []
    total.value = res.total || 0
  } catch (err:any) {
    toast.value = err?.message || 'Failed to load routes'
    setTimeout(()=> toast.value = '', 3000)
  } finally {
    setLoading(false)
  }
}

onMounted(async () => {
  const savedVisible = localStorage.getItem('routes_visible_columns')
  if (savedVisible) {
    try {
      const parsed = JSON.parse(savedVisible)
      if (parsed) visibleColumns.value = parsed
    } catch {}
  }
  const savedColumns = localStorage.getItem('routes_column_visibility')
  if (savedColumns) {
    try {
      const parsed = JSON.parse(savedColumns)
      if (parsed) tableState.value.columnVisibility = parsed
    } catch {}
  }
  const savedSorting = localStorage.getItem('routes_sorting')
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
  if (Array.isArray(config.surfaceOptions) && config.surfaceOptions.length) {
    surfaceOptions.value = config.surfaceOptions
  }
  if (Array.isArray(config.pageSizeOptions) && config.pageSizeOptions.length) {
    pageSizeOptions.value = config.pageSizeOptions
  }
  if (!surfaceOptions.value.includes(form.value.surface)) {
    form.value.surface = surfaceOptions.value[0] || ''
  }
  if (!pageSizeOptions.value.includes(tableState.value.pagination.pageSize || 10)) {
    tableState.value.pagination.pageSize = pageSizeOptions.value[0] || 10
    tableState.value.pagination.pageIndex = 0
  }
  if (config.routesColumnVisibility) {
    tableState.value.columnVisibility = { ...defaultColumnVisibility, ...config.routesColumnVisibility }
    localStorage.setItem('routes_column_visibility', JSON.stringify(tableState.value.columnVisibility))
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

const filtered = computed(()=>{
  const s = search.value.toLowerCase()
  return rows.value.filter(r=>{
    return !s || (r.description && r.description.toLowerCase().includes(s)) || (r.start && r.start.toLowerCase().includes(s)) || (r.destination && r.destination.toLowerCase().includes(s))
  }).sort((a,b)=>{
    const A = a[sortBy.value]
    const B = b[sortBy.value]
    if (A===B) return 0
    if (sortDir.value==='asc') return A>B?1:-1
    return A>B?-1:1
  })
})

const defaultColumnVisibility = allColumns.reduce((acc, col) => {
  acc[col.key] = true
  return acc
}, {} as Record<string, boolean>)
const tableState = ref({ globalFilter: '', sorting: [{ id: 'link', desc: true }], pagination: { pageIndex: 0, pageSize: 10 }, columnVisibility: defaultColumnVisibility })

watch(() => tableState.value.columnVisibility, (v)=>{
  if (typeof window === 'undefined') return
  localStorage.setItem('routes_column_visibility', JSON.stringify(v))
}, { deep: true })

watch(() => tableState.value.sorting, (v) => {
  if (typeof window === 'undefined') return
  localStorage.setItem('routes_sorting', JSON.stringify(v || []))
}, { deep: true })

watch(tableState, (v)=> fetchDebounced(v), { deep: true })

const { loading, setLoading, wrap } = useGlobalLoading()

const start = computed(()=> (tableState.value.pagination?.pageIndex || 0) * (tableState.value.pagination?.pageSize || 10))
const end = computed(()=> Math.min(start.value + (tableState.value.pagination?.pageSize || 10), total.value))
const pagedRows = computed(()=> rows.value)

const tableColumns = computed(() => [
  { accessorKey: 'id', headerLabel: 'ID', enableSorting: true },
  { accessorKey: 'description', headerLabel: 'Description', enableSorting: true },
  { accessorKey: 'distance', headerLabel: 'Distance', enableSorting: true },
  { accessorKey: 'start', headerLabel: 'Start' },
  { accessorKey: 'destination', headerLabel: 'Destination' },
  { accessorKey: 'grade', headerLabel: 'Grade' },
  { accessorKey: 'surface', headerLabel: 'Surface' },
  { accessorKey: 'reference', headerLabel: 'Reference' },
  { accessorKey: 'link', headerLabel: 'Link', enableSorting: true,
    cell: (ctx: { getValue: () => any; row: { original: any } }) => {
      const value = ctx.getValue()
      if (ctx.row.original.reference) return h('a', { href: ctx.row.original.reference, target: '_blank', class: 'text-blue-600 hover:underline' }, value || 'Link')
      return value || ''
    }
  },
  { accessorKey: 'notes', headerLabel: 'Notes' }
])

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

function handleSelectionChange(ids: (string | number)[]) {
  selectedRows.value = ids.map(id => Number(id))
}

function handleTableSelect(e: MouseEvent, row: any) {
  // Keep single-click behavior for backward compatibility
  if (!e.ctrlKey && !e.metaKey) {
    const rowId = row?.id
    if (selectedRows.value.includes(rowId)) {
      selectedRows.value = []
    } else {
      selectedRows.value = [rowId]
    }
  }
}

function onEdit(){
  if (selectedRows.value.length !== 1) return
  const selectedId = selectedRows.value[0]
  const selectedRow = rows.value.find(r => r.id === selectedId)
  if (!selectedRow) return
  isEditing.value = true
  const r = selectedRow
  form.value = { ...r }
  nextTick(()=>{
    const el = document.querySelector('input[type=text]') as HTMLInputElement
    el?.focus()
  })
}

function onDelete(){
  if (selectedRows.value.length === 0) return
  showConfirm.value = true
}

async function confirmDelete(){
  if (selectedRows.value.length === 0) return
  try {
    await Promise.all(
      selectedRows.value.map(id => 
        $fetch(`/api/routes?id=${id}`, { method: 'DELETE' })
      )
    )
    showConfirm.value = false
    toast.value = `${selectedRows.value.length} route${selectedRows.value.length > 1 ? 's' : ''} deleted`
    setTimeout(()=> toast.value = '', 2500)
    selectedRows.value = []
    load()
  } catch (err) {
    toast.value = 'Failed to delete routes'
    setTimeout(()=> toast.value = '', 2500)
  }
}

function onReferenceInput(){
  if (!form.value.reference) form.value.link = ''
  else if (!form.value.link) form.value.link = 'Link'
}

function clearForm(){
  form.value = { id: null, description: '', distance: null, grade: null, start: '', destination: '', surface: 'Road', reference: '', link: '', notes: '' }
  isEditing.value = false
}

async function onSubmit(){
  if (isEditing.value){
    await $fetch('/api/routes', { method: 'PUT', body: form.value })
    isEditing.value = false
    selectedRows.value = []
    toast.value = 'Route updated'
  } else {
    const body = { ...form.value }
    if (body.reference && !body.link) body.link = 'Link'
    await $fetch('/api/routes', { method: 'POST', body })
    toast.value = 'Route added'
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
