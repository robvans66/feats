<template>
  <div class="w-full overflow-x-auto">
    <table class="min-w-full">
      <thead>
        <tr class="bg-gray-100">
          <th v-for="col in visibleColumns" :key="colId(col)" class="p-2 text-left">
            <button v-if="col.enableSorting" class="flex items-center space-x-1" @click="toggleSorting(col)">
              <span>{{ col.headerLabel || colId(col) }}</span>
              <span v-if="getIsSorted(colId(col))" class="ml-1">{{ getIsSorted(colId(col)) === 'asc' ? '▲' : '▼' }}</span>
            </button>
            <span v-else>{{ col.headerLabel || colId(col) }}</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="!data || data.length === 0">
          <td :colspan="visibleColumns.length" class="p-3 text-sm text-gray-500">
            No rows
          </td>
        </tr>
        <tr
          v-for="(row, idx) in data"
          v-else
          :key="rowKey(row, idx)"
          :class="rowClass(row, idx)"
          @click="onRowClick($event, row)"
        >
          <td v-for="col in visibleColumns" :key="colId(col)" class="p-2">
            <component v-if="isVNode(cellContent(col, row))" :is="cellContent(col, row)" />
            <span v-else>{{ cellContent(col, row) }}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed, isVNode } from 'vue'

type ColumnDef = {
  key?: string
  accessorKey?: string
  headerLabel?: string
  header?: (ctx: any) => any
  cell?: (ctx: any) => any
  enableSorting?: boolean
}

type SortState = { id: string; desc?: boolean }

type TableState = {
  globalFilter?: string
  sorting?: SortState[]
  pagination?: { pageIndex?: number; pageSize?: number }
  columnVisibility?: Record<string, boolean>
}

const props = defineProps<{
  data: any[]
  columns: ColumnDef[]
  state: TableState
  onStateChange?: (updaterOrValue: any) => void
  onSelect?: (event: MouseEvent, row: any) => void
  selectedRowId?: string | number | null
}>()

const visibleColumns = computed(() => {
  const visibility = props.state?.columnVisibility || {}
  return (props.columns || []).filter((col) => {
    const key = colId(col)
    if (!key) return true
    return visibility[key] !== false
  })
})

function colId(col: ColumnDef) {
  return col.accessorKey || col.key || col.headerLabel || ''
}

function getIsSorted(id: string) {
  const sorting = props.state?.sorting
  if (!Array.isArray(sorting)) return false
  const found = sorting.find((s) => s.id === id)
  if (!found) return false
  return found.desc ? 'desc' : 'asc'
}

function toggleSorting(col: ColumnDef) {
  if (!props.onStateChange) return
  const id = colId(col)
  if (!id) return
  props.onStateChange((prev: TableState) => {
    const current = Array.isArray(prev.sorting) ? prev.sorting[0] : undefined
    let nextSorting: SortState[] = []
    if (!current || current.id !== id) {
      nextSorting = [{ id, desc: false }]
    } else if (current.desc === false || current.desc === undefined) {
      nextSorting = [{ id, desc: true }]
    }
    return { ...prev, sorting: nextSorting }
  })
}

function getCellValue(row: any, col: ColumnDef) {
  if (col.accessorKey) return row?.[col.accessorKey]
  if (col.key) return row?.[col.key]
  return ''
}

function cellContent(col: ColumnDef, row: any) {
  if (typeof col.cell === 'function') {
    return col.cell({ getValue: () => getCellValue(row, col), row: { original: row } })
  }
  return getCellValue(row, col)
}

function rowKey(row: any, idx: number) {
  return row?.id ?? idx
}

function rowClass(row: any, idx: number) {
  const key = rowKey(row, idx)
  const isSelected = props.selectedRowId !== undefined && key === props.selectedRowId
  return isSelected ? 'is-selected cursor-pointer' : 'hover:bg-gray-50 cursor-pointer'
}

function onRowClick(event: MouseEvent, row: any) {
  props.onSelect?.(event, row)
}
</script>
