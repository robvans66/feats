<template>
  <section>
    <form @submit.prevent="onSubmit" class="bg-gray-100 p-4 mb-6 border rounded shadow">
      <h1 class="text-3xl font-semibold mb-6">Add Ride</h1>
      <div class="grid grid-cols-6 gap-4">
        <div class="col-span-1">
          <label class="block text-sm">Date*</label>
          <input v-model="form.date" type="date" required class="border px-2 py-1 w-full bg-amber-50" />
        </div>
        <div class="col-span-2">
          <label class="block text-sm">Description*</label>
          <input v-model="form.description" type="text" required class="border px-2 py-1 w-full" />
        </div>
        <div class="col-span-1">
          <label class="block text-sm">Distance*</label>
          <input v-model.number="form.distance" type="number" step="0.1" required class="border px-2 py-1 w-full" />
        </div>
        <div class="col-span-1">
          <label class="block text-sm">Average</label>
          <input v-model.number="form.average" type="number" step="0.1" class="border px-2 py-1 w-full" />
        </div>
        <div class="col-span-1">
          <label class="block text-sm">Bike*</label>
          <select v-model="form.bike" required class="border px-2 py-1 w-full">
            <option value="Santos">Santos</option>
            <option value="Rimonta">Rimonta</option>
            <option value="Gazelle">Gazelle</option>
            <option value="Wahoo">Wahoo</option>
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
          <button type="submit" class="fts px-3 py-1" :disabled="loading">{{ isEditing ? 'Update' : 'Add' }}</button>
          <button type="button" @click="clearForm" class="fts px-3 py-1 border" :disabled="loading">Clear</button>
        </div>
      </div>
    </form>

    <ConfirmModal :show="showConfirm" title="Delete Ride" message="Are you sure you want to delete the selected ride?" @confirm="confirmDelete" @cancel="()=>showConfirm=false" />
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
    { key: 'date', label: 'Date' },
    { key: 'description', label: 'Description' },
    { key: 'distance', label: 'Distance' },
    { key: 'average', label: 'Average' },
    { key: 'bike', label: 'Bike' },
    { key: 'reference', label: 'Reference' },
    { key: 'link', label: 'Link' },
    { key: 'notes', label: 'Notes' }
  ]

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

const form = ref({ id: null, date: '', description: '', distance: null, average: null, bike: 'Santos', reference: '', link: '', notes: '' })
const toast = ref('')
const showConfirm = ref(false)

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

onMounted(() => {
  const saved = localStorage.getItem('rides_column_visibility')
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      if (parsed) tableState.value.columnVisibility = parsed
    } catch {}
  }
  load()
})

function fetchDebounced(state?: any){
  clearTimeout(loadTimeout)
  loadTimeout = setTimeout(()=> load(state), 200)
}

const { loading, setLoading, wrap } = useGlobalLoading()

  // Table-managed state (globalFilter, sorting, pagination)
  const tableState = ref({ globalFilter: '', sorting: [], pagination: { pageIndex: 0, pageSize: 10 }, columnVisibility: defaultColumnVisibility })

  watch(() => tableState.value.columnVisibility, (v)=>{
    if (typeof window === 'undefined') return
    localStorage.setItem('rides_column_visibility', JSON.stringify(v))
  }, { deep: true })

watch(tableState, (v)=> fetchDebounced(v), { deep: true })

  const start = computed(()=> (tableState.value.pagination?.pageIndex || 0) * (tableState.value.pagination?.pageSize || 10))
  const end = computed(()=> Math.min(start.value + (tableState.value.pagination?.pageSize || 10), total.value))


const tableColumns = [
  { accessorKey: 'id', headerLabel: 'ID', header: (ctx:any) => {
      const col = ctx.column
      const sorted = col.getIsSorted?.()
      const indicator = sorted ? (sorted === 'asc' ? '▲' : '▼') : ''
      return h('button', { class: 'flex items-center space-x-1', onClick: () => col.toggleSorting?.() }, [ h('span', ctx.column.columnDef.headerLabel || ctx.column.id), indicator ? h('span', { class: 'ml-1' }, indicator) : null, (loading.value && sorted) ? h('span', { class: 'ml-1 animate-spin text-sm' }, '⟳') : null ])
    }
  },
  { accessorKey: 'date', headerLabel: 'Date', header: (ctx:any) => {
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
  { accessorKey: 'average', headerLabel: 'Average' },
  { accessorKey: 'bike', headerLabel: 'Bike' },
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
  form.value = { id: null, date: '', description: '', distance: null, average: null, bike: 'Santos', reference: '', link: '', notes: '' }
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
