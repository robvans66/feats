<template>
  <section>
    <h2 class="text-xl font-semibold mb-3">Year Totals</h2>
    <div class="bg-white border mb-6">
      <table class="min-w-full">
        <thead><tr class="bg-gray-100"><th class="p-2">Year</th><th class="p-2">Distance</th><th class="p-2">Total Rides</th></tr></thead>
        <tbody>
          <tr v-for="r in stats.yearTotals" :key="r.year" class="hover:bg-gray-50"><td class="p-2">{{r.year}}</td><td class="p-2">{{r.distance}}</td><td class="p-2">{{r.rides}}</td></tr>
        </tbody>
      </table>
    </div>

    <h2 class="text-xl font-semibold mb-3">Distance and Rides per Bike in current year</h2>
    <div class="bg-white border mb-6">
      <table class="min-w-full">
        <thead><tr class="bg-gray-100"><th class="p-2">Bike</th><th class="p-2">Distance</th><th class="p-2">Number</th></tr></thead>
        <tbody>
          <tr v-for="r in stats.perBike" :key="r.bike" class="hover:bg-gray-50"><td class="p-2">{{r.bike}}</td><td class="p-2">{{r.distance}}</td><td class="p-2">{{r.rides}}</td></tr>
        </tbody>
      </table>
    </div>

    <h2 class="text-xl font-semibold mb-3">Longest Ride per Year</h2>
    <div class="bg-white border mb-6">
      <table class="min-w-full">
        <thead><tr class="bg-gray-100"><th class="p-2">Year</th><th class="p-2">Longest Ride</th></tr></thead>
        <tbody>
          <tr v-for="r in stats.longestPerYear" :key="r.year" class="hover:bg-gray-50"><td class="p-2">{{r.year}}</td><td class="p-2">{{r.longest}}</td></tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
const stats = ref({ yearTotals:[], perBike:[], longestPerYear:[] })
onMounted(async ()=>{
  const d:any = await $fetch('/api/stats')
  stats.value = d
})
</script>
