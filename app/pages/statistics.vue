<template>
  <section>
    <h1 class="text-3xl font-semibold mb-6">Statistics</h1>
    <div class="grid gap-15 lg:grid-cols-3">
      <div>
        <h2 class="text-xl font-semibold mb-3">Year Totals</h2>
        <div class="bg-white border">
          <table class="table-statistics min-w-full">
            <thead><tr class="bg-gray-100"><th class="p-2">Year</th><th class="p-2">Distance</th><th class="p-2">Total Rides</th></tr></thead>
            <tbody>
              <tr
                v-for="r in stats.yearTotals"
                :key="r.year"
                :class="['hover:bg-gray-50 cursor-pointer', { 'is-selected': selectedYearTotal === r.year }]"
                @click="toggleSelectedYearTotal(r.year)"
              ><td class="p-2">{{r.year}}</td><td class="p-2">{{r.distance}}</td><td class="p-2">{{r.rides}}</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 class="text-xl font-semibold mb-3">Distance and Rides per Bike in {{ currentYear }}</h2>
        <div class="bg-white border">
          <table class="table-statistics min-w-full">
            <thead><tr class="bg-gray-100"><th class="p-2">Bike</th><th class="p-2">Distance</th><th class="p-2">Number</th></tr></thead>
            <tbody>
              <tr
                v-for="r in stats.perBike"
                :key="r.bike"
                :class="['hover:bg-gray-50 cursor-pointer', { 'is-selected': selectedBike === r.bike }]"
                @click="toggleSelectedBike(r.bike)"
              ><td class="p-2">{{r.bike}}</td><td class="p-2">{{r.distance}}</td><td class="p-2">{{r.rides}}</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 class="text-xl font-semibold mb-3">Longest Ride per Year</h2>
        <div class="bg-white border">
          <table class="table-statistics min-w-full">
            <thead><tr class="bg-gray-100"><th class="p-2">Year</th><th class="p-2">Longest Ride</th></tr></thead>
            <tbody>
              <tr
                v-for="r in stats.longestPerYear"
                :key="r.year"
                :class="['hover:bg-gray-50 cursor-pointer', { 'is-selected': selectedLongestYear === r.year }]"
                @click="toggleSelectedLongestYear(r.year)"
              ><td class="p-2">{{r.year}}</td><td class="p-2">{{r.longest}}</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { computed } from 'vue'
import { $fetch } from 'ofetch'

const currentYear = computed(() => new Date().getFullYear())

const stats = ref({ yearTotals:[], perBike:[], longestPerYear:[] })
const selectedYearTotal = ref<number | null>(null)
const selectedBike = ref<string | null>(null)
const selectedLongestYear = ref<number | null>(null)

function toggleSelectedYearTotal(year: number) {
  selectedYearTotal.value = selectedYearTotal.value === year ? null : year
}

function toggleSelectedBike(bike: string) {
  selectedBike.value = selectedBike.value === bike ? null : bike
}

function toggleSelectedLongestYear(year: number) {
  selectedLongestYear.value = selectedLongestYear.value === year ? null : year
}
onMounted(async () => {
  const d:any = await $fetch('/api/stats')
  stats.value = d
})
</script>
