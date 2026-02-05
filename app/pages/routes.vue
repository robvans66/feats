<template>
  <section>
    <form @submit.prevent="onSubmit" class="bg-white p-4 mb-6 border">
      <div class="grid grid-cols-6 gap-4">
        <div class="col-span-2">
          <label class="block text-sm">Description*</label>
          <input v-model="form.description" type="text" required class="border px-2 py-1 w-full" />
        </div>
        <div class="col-span-1">
          <label class="block text-sm">Distance*</label>
          <input v-model.number="form.distance" type="number" step="0.1" required class="border px-2 py-1 w-full" />
        </div>
        <div class="col-span-1">
          <label class="block text-sm">Start*</label>
          <input v-model="form.start" type="text" required class="border px-2 py-1 w-full" />
        </div>
        <div class="col-span-1">
          <label class="block text-sm">Destination*</label>
          <input v-model="form.destination" type="text" required class="border px-2 py-1 w-full" />
        </div>
        <div class="col-span-1">
          <label class="block text-sm">Surface*</label>
          <select v-model="form.surface" required class="border px-2 py-1 w-full">
            <option>Road</option>
            <option>Gravel</option>
            <option>Road/Gravel</option>
            <option>Gravel/MTB</option>
          </select>
        </div>
        <div class="col-span-2">
          <label class="block text-sm">Reference</label>
          <input v-model="form.reference" type="text" class="border px-2 py-1 w-full" @input="onReferenceInput" />
        </div>
        <div class="col-span-1">
          <label class="block text-sm">Link</label>
          <input v-model="form.link" :disabled="!form.reference" type="text" class="border px-2 py-1 w-full" />
        </div>
        <div class="col-span-2">
          <label class="block text-sm">Notes</label>
          <input v-model="form.notes" type="text" class="border px-2 py-1 w-full" />
        </div>
        <div class="col-span-1 flex items-end space-x-2">
          <button type="submit" class="px-3 py-1 fts" :disabled="loading">{{ isEditing ? 'Update' : 'Add' }}</button>
          <button type="button" @click="clearForm" class="px-3 py-1 border fts" :disabled="loading">Clear</button>
        </div>
      </div>
    </form>

    <ConfirmModal :show="showConfirm" title="Delete Route" message="Are you sure you want to delete the selected route?" @confirm="confirmDelete" @cancel="()=>showConfirm=false" />
    <Toast :message="toast" />

    <div class="flex items-center justify-between mt-4 mb-4">
      <div class="flex items-center space-x-2">
        <button class="px-3 py-1 fts disabled:opacity-50" :disabled="!selectedRow || loading" @click="onEdit">Edit</button>
        <button class="px-3 py-1 fts-delete disabled:opacity-50" :disabled="!selectedRow || loading" @click="onDelete">Delete</button>
      </div>
      <div class="flex items-center space-x-2">
          <input v-model="tableState.globalFilter" placeholder="Search" class="border px-2 py-1" />
          <select v-model.number="tableState.pagination.pageSize" @change="(e)=>setPageSize(tableState.pagination.pageSize)" class="border px-2 py-1">
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="20">20</option>
          </select>
        <div class="relative z-20">
          <button @click="showCols = !showCols" class="border px-2 py-1">Columns ▾</button>
          <div v-if="showCols" class="absolute right-0 mt-2 bg-white border p-2 shadow z-30">
            <label v-for="c in allColumns" :key="c.key" class="block"><input type="checkbox" v-model="tableState.columnVisibility[c.key]" /> {{c.label}}</label>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white border overflow-x-auto relative">
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
import { ref, computed, onMounted, nextTick, watch, h } from 'vue'
import { $fetch } from 'ofetch'
import { useGlobalLoading } from '../composables/useGlobalLoading'

const allColumns = [
  { key: 'id', label: 'ID' },
  { key: 'description', label: 'Description' },
  { key: 'distance', label: 'Distance' },
  { key: 'start', label: 'Start' },
  { key: 'destination', label: 'Destination' },
  { key: 'surface', label: 'Surface' },
  { key: 'reference', label: 'Reference' },
  { key: 'link', label: 'Link' },
  { key: 'notes', label: 'Notes' }
]

const rows = ref<any[]>([])
const total = ref(0)
const page = ref(0)
const search = ref('')
const sortBy = ref('distance')
const sortDir = ref<'asc'|'desc'>('desc')
const selectedRow = ref<any | null>(null)
const isEditing = ref(false)
const showCols = ref(false)
const defaultVisibleColumns = allColumns.map(c => c.key)
const visibleColumns = ref(defaultVisibleColumns)

const form = ref({ id: null, description: '', distance: null, start: '', destination: '', surface: 'Road', reference: '', link: '', notes: '' })
const toast = ref('')
const showConfirm = ref(false)

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

onMounted(() => {
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
  load()
})

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
const tableState = ref({ globalFilter: '', sorting: [], pagination: { pageIndex: 0, pageSize: 10 }, columnVisibility: defaultColumnVisibility })

watch(() => tableState.value.columnVisibility, (v)=>{
  if (typeof window === 'undefined') return
  localStorage.setItem('routes_column_visibility', JSON.stringify(v))
}, { deep: true })

watch(tableState, (v)=> fetchDebounced(v), { deep: true })

const { loading, setLoading, wrap } = useGlobalLoading()

const start = computed(()=> (tableState.value.pagination?.pageIndex || 0) * (tableState.value.pagination?.pageSize || 10))
const end = computed(()=> Math.min(start.value + (tableState.value.pagination?.pageSize || 10), total.value))
const pagedRows = computed(()=> rows.value)

const tableColumns = [
  { accessorKey: 'id', headerLabel: 'ID', header: (ctx:any) => {
      const col = ctx.column
      const sorted = col.getIsSorted?.()
      const indicator = sorted ? (sorted === 'asc' ? '▲' : '▼') : ''
      return h('button', { class: 'flex items-center space-x-1', onClick: () => col.toggleSorting?.() }, [ h('span', ctx.column.columnDef.headerLabel || ctx.column.id), indicator ? h('span', { class: 'ml-1' }, indicator) : null, (loading.value && sorted) ? h('span', { class: 'ml-1 animate-spin text-sm' }, '⟳') : null ])
    }
  },
  { accessorKey: 'description', headerLabel: 'Description', header: (ctx:any) => {
      const col = ctx.column
      const sorted = col.getIsSorted?.()
      const indicator = sorted ? (sorted === 'asc' ? '▲' : '▼') : ''
      return h('button', { class: 'flex items-center space-x-1', onClick: () => col.toggleSorting?.() }, [ h('span', ctx.column.columnDef.headerLabel || ctx.column.id), indicator ? h('span', { class: 'ml-1' }, indicator) : null, (loading.value && sorted) ? h('span', { class: 'ml-1 animate-spin text-sm' }, '⟳') : null ])
    }
  },
  { accessorKey: 'distance', headerLabel: 'Distance', header: (ctx:any) => {
      const col = ctx.column
      const sorted = col.getIsSorted?.()
      const indicator = sorted ? (sorted === 'asc' ? '▲' : '▼') : ''
      return h('button', { class: 'flex items-center space-x-1', onClick: () => col.toggleSorting?.() }, [ h('span', ctx.column.columnDef.headerLabel || ctx.column.id), indicator ? h('span', { class: 'ml-1' }, indicator) : null, (loading.value && sorted) ? h('span', { class: 'ml-1 animate-spin text-sm' }, '⟳') : null ])
    }
  },
  { accessorKey: 'start', headerLabel: 'Start' },
  { accessorKey: 'destination', headerLabel: 'Destination' },
  { accessorKey: 'surface', headerLabel: 'Surface' },
  { accessorKey: 'reference', headerLabel: 'Reference' },
  { accessorKey: 'link', headerLabel: 'Link', cell: (ctx: { getValue: () => any; row: { original: any } }) => {
      const value = ctx.getValue()
      if (ctx.row.original.reference) return h('a', { href: ctx.row.original.reference, target: '_blank', class: 'text-blue-600 hover:underline' }, value || 'Link')
      return value || ''
    }
  },
  { accessorKey: 'notes', headerLabel: 'Notes' }
]

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



function selectRow(row:any){ selectedRow.value = row }

function onEdit(){
  if (!selectedRow.value) return
  isEditing.value = true
  const r = selectedRow.value
  form.value = { ...r }
  nextTick(()=>{
    const el = document.querySelector('input[type=text]') as HTMLInputElement
    el?.focus()
  })
}

function onDelete(){
  if (!selectedRow.value) return
  showConfirm.value = true
}

async function confirmDelete(){
  if (!selectedRow.value) return
  await $fetch(`/api/routes?id=${selectedRow.value.id}`, { method: 'DELETE' })
  showConfirm.value = false
  toast.value = 'Route deleted'
  setTimeout(()=> toast.value = '', 2500)
  selectedRow.value = null
  load()
}

function onReferenceInput(){
  if (!form.value.reference) form.value.link = ''
  else if (!form.value.link) form.value.link = 'Link'
}

function clearForm(){
  form.value = { id: null, description: '', distance: null, start: '', destination: '', surface: 'Road', reference: '', link: '', notes: '' }
  isEditing.value = false
}

async function onSubmit(){
  if (isEditing.value){
    await $fetch('/api/routes', { method: 'PUT', body: form.value })
    isEditing.value = false
    selectedRow.value = null
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
