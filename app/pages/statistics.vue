<template>
  <section>
    <h1 class="text-3xl font-semibold mb-6">Statistics</h1>
    <div class="grid gap-15 lg:grid-cols-3">
      <div>
        <h2 class="text-xl font-semibold mb-3">Year Totals</h2>
        <div class="table-statistics bg-white border">
          <Table
            :data="sortedYearTotals"
            :columns="yearTotalsColumns"
            :state="yearTotalsState"
            :on-state-change="setYearTotalsState"
            :on-select="(_e, row) => toggleSelectedYearTotal(row.year)"
            :selected-row-id="selectedYearTotal"
          />
        </div>
      </div>

      <div>
        <h2 class="text-xl font-semibold mb-3">Longest Ride per Year</h2>
        <div class="table-statistics bg-white border">
          <Table
            :data="sortedLongestPerYear"
            :columns="longestPerYearColumns"
            :state="longestPerYearState"
            :on-state-change="setLongestPerYearState"
            :on-select="(_e, row) => toggleSelectedLongestYear(row.year)"
            :selected-row-id="selectedLongestYear"
          />
        </div>
      </div>

      <div>
        <h2 class="text-xl font-semibold mb-3">Distance and Rides per Bike in {{ currentYear }}</h2>
        <div class="table-statistics bg-white border">
          <Table
            :data="sortedPerBike"
            :columns="perBikeColumns"
            :state="perBikeState"
            :on-state-change="setPerBikeState"
            :on-select="(_e, row) => toggleSelectedBike(row.bike)"
            :selected-row-id="selectedBike"
          />
        </div>
      </div>

    </div>

    <div class="mt-12">
      <h2 class="text-xl font-semibold mb-3">Rides Over 100km per Year</h2>
      <div class="table-statistics bg-white border">
        <Table
          :data="sortedRidesOver100"
          :columns="ridesOver100Columns"
          :state="ridesOver100State"
          :on-state-change="setRidesOver100State"
          :on-select="(_e, row) => toggleSelectedOver100Year(row.year)"
          :selected-row-id="selectedOver100Year"
        />
      </div>
    </div>

    <div class="mt-12">
      <h2 class="text-xl font-semibold mb-3">Monthly Totals by Year</h2>
      <div class="bg-white border overflow-x-auto">
        <table class="table-statistics min-w-full">
          <thead>
            <tr class="bg-gray-100">
              <th class="p-2">Year</th>
              <th class="p-2" v-for="month in monthNames" :key="month">{{ month }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="year in uniqueYears" :key="year">
              <td class="p-2 font-semibold">{{ year }}</td>
              <td v-for="monthNum in [1,2,3,4,5,6,7,8,9,10,11,12]" :key="`${year}-${monthNum}`" class="p-2 border-l text-xs">
                <div v-if="getMonthData(year, monthNum)">
                  <div>{{ getMonthData(year, monthNum).distance }} km</div>
                  <div class="text-gray-600">{{ getMonthData(year, monthNum).rides }} rides</div>
                </div>
                <div v-else class="text-gray-400">-</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { $fetch } from 'ofetch'

const currentYear = computed(() => new Date().getFullYear())

const stats = ref({ yearTotals:[], perBike:[], longestPerYear:[], monthlyTotals:[], ridesOver100ByYear:[] })
const selectedYearTotal = ref<number | null>(null)
const selectedBike = ref<string | null>(null)
const selectedLongestYear = ref<number | null>(null)
const selectedOver100Year = ref<string | null>(null)

// Table states
const yearTotalsState = ref<any>({ sorting: [] })
const longestPerYearState = ref<any>({ sorting: [] })
const perBikeState = ref<any>({ sorting: [] })
const ridesOver100State = ref<any>({ sorting: [{ id: 'year', desc: true }] })

// Column definitions
const yearTotalsColumns = [
  { accessorKey: 'year', headerLabel: 'Year', enableSorting: true },
  { accessorKey: 'distance', headerLabel: 'Distance', enableSorting: true },
  { accessorKey: 'rides', headerLabel: 'Total Rides', enableSorting: true }
]

const longestPerYearColumns = [
  { accessorKey: 'year', headerLabel: 'Year', enableSorting: true },
  { accessorKey: 'longest', headerLabel: 'Longest Ride', enableSorting: true }
]

const perBikeColumns = [
  { accessorKey: 'bike', headerLabel: 'Bike', enableSorting: true },
  { accessorKey: 'distance', headerLabel: 'Distance', enableSorting: true },
  { accessorKey: 'rides', headerLabel: 'Number', enableSorting: true }
]

const ridesOver100Columns = [
  { accessorKey: 'year', headerLabel: 'Year', enableSorting: true },
  { accessorKey: 'count', headerLabel: 'Rides > 100km', enableSorting: true },
  { 
    accessorKey: 'distancesFormatted', 
    headerLabel: 'Distances (km)', 
    enableSorting: false,
    cell: (ctx: any) => ctx.getValue()
  }
]

// State setters
function setYearTotalsState(updater: any) {
  yearTotalsState.value = typeof updater === 'function' ? updater(yearTotalsState.value) : updater
}

function setLongestPerYearState(updater: any) {
  longestPerYearState.value = typeof updater === 'function' ? updater(longestPerYearState.value) : updater
}

function setPerBikeState(updater: any) {
  perBikeState.value = typeof updater === 'function' ? updater(perBikeState.value) : updater
}

function setRidesOver100State(updater: any) {
  ridesOver100State.value = typeof updater === 'function' ? updater(ridesOver100State.value) : updater
}

// Sorted data computed properties
const sortedYearTotals = computed(() => {
  return sortData(stats.value.yearTotals, yearTotalsState.value.sorting)
})

const sortedLongestPerYear = computed(() => {
  return sortData(stats.value.longestPerYear, longestPerYearState.value.sorting)
})

const sortedPerBike = computed(() => {
  return sortData(stats.value.perBike, perBikeState.value.sorting)
})

const sortedRidesOver100 = computed(() => {
  // Format the distances column with first 10 and "and X more" if needed
  const formatted = stats.value.ridesOver100ByYear.map((item: any) => {
    const distances = item.distances || []
    const displayDistances = distances.slice(0, 15)
    const remaining = distances.length - 15
    
    let distancesText = displayDistances.join(', ')
    if (remaining > 0) {
      distancesText += ` and ${remaining} more`
    }
    
    return {
      ...item,
      distancesFormatted: distancesText
    }
  })
  
  return sortData(formatted, ridesOver100State.value.sorting)
})

function sortData(data: any[], sorting: any[]) {
  if (!sorting || sorting.length === 0) return data
  const sortSpec = sorting[0]
  const sorted = [...data].sort((a, b) => {
    const aVal = a[sortSpec.id]
    const bVal = b[sortSpec.id]
    if (aVal === bVal) return 0
    if (aVal == null) return 1
    if (bVal == null) return -1
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return aVal - bVal
    }
    return String(aVal).localeCompare(String(bVal))
  })
  return sortSpec.desc ? sorted.reverse() : sorted
}

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const uniqueYears = computed(() => {
  const years = new Set(stats.value.monthlyTotals.map((m: any) => m.year))
  return Array.from(years).sort((a, b) => b - a)
})

function getMonthData(year: string, month: number) {
  const paddedMonth = String(month).padStart(2, '0')
  return stats.value.monthlyTotals.find((m: any) => m.year === year && m.month === paddedMonth)
}

function toggleSelectedYearTotal(year: number) {
  selectedYearTotal.value = selectedYearTotal.value === year ? null : year
}

function toggleSelectedBike(bike: string) {
  selectedBike.value = selectedBike.value === bike ? null : bike
}

function toggleSelectedLongestYear(year: number) {
  selectedLongestYear.value = selectedLongestYear.value === year ? null : year
}

function toggleSelectedOver100Year(year: string) {
  selectedOver100Year.value = selectedOver100Year.value === year ? null : year
}

onMounted(async () => {
  const d:any = await $fetch('/api/stats')
  stats.value = d
})
</script>
