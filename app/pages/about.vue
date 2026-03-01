<template>
  <section class="max-w-3xl mx-auto px-4 py-8">
    <h1 class="text-2xl pt-8 font-semibold mb-3">About Feats</h1>
    <div class="flex items-start gap-4">
      <p class="mb-4 flex-1">Feats is a small application to keep track of completed bicycle rides and planned bicycle routes.
        <br><br>
        It is a personal project to have a simple tool to keep track of my rides and routes. It is not intended to be a full-featured application, but rather a simple and easy-to-use tool for myself and anyone else who might find it useful. I use multiple bicycle platforms and thought it would be handy to have an overview of all my rides and routes in one place. And I think it can also be useful for others who don't use any bicycle platform at all.<br><br>
        The name "Feats" is a play on words, as it can refer to both "feats" as in achievements (completing rides and routes), and "fiets" which is the Dutch word for bicycle, pronounced similarly.<br><br>
      </p>
      <img 
        :src="isDark ? '/fts-logo-darkmode.png' : '/fts-logo-regular.png'" 
        alt="Feats logo" 
        class="w-32 h-32 shrink-0"
      >
    </div>

    <h1 class="text-2xl pt-8 font-semibold mb-3">Using Feats</h1>
    <h2 class="text-xl pt-4 mb-3 font-semibold">Overview</h2>
    <p class="mb-4">Feats is designed to be simple and easy to use. You can add, edit, and delete rides and routes, view statistics, and configure the application to your liking. The application consists of five pages: Rides (which is also the home page), Routes, Statistics, Configuration, and About.</p>
    <p class="mb-4">The Rides page allows you to keep track of your completed rides, including details such as date, distance, average speed, and notes. The Routes page is for planning future rides, where you can save the route name, distance, and notes. The Statistics page provides insights into your riding habits and achievements. The Configuration page allows you to customize the application settings, such as the bikes you ride and other preferences.</p>
    <p class="mb-4">
      The application uses a local SQLite database to store your data, so all your rides and routes are stored locally on your device. This means that you can use the application offline, and your data will be available even if you don't have an internet connection. When you start the application for the first time, it will create a new database and populate it with some sample data. You can then start playing around with Feats by adding, editing, and deleting rides and routes, and exploring the different statistic tables and charts of the application. 
    </p>

    <h2 class="text-xl pt-4 mb-3 font-semibold">Rides page</h2>
    <p class="mb-4">On the Rides page, you can add a new ride by filling out the form and clicking the "Add" button. You can also edit a single existing ride or delete multiple existing rides.<br><br>
    In de 'Reference' field you can add a URL to the route on an external bicycle platform like RWGPS, Komoot or Strava, and in the 'Link' field you can add a short text that will appear as a clickable link in the table below.<br><br>
    In the Columns section, you can choose which columns to show in the table, and you can also sort the table by clicking on the column headers. Note that hidden columns, although not visible, are also included in a search.
    </p>

    <h2 class="text-xl pt-4 mb-3 font-semibold">Routes page</h2>
    <p class="mb-4">The Routes page is similar to the Rides page, but it is for planning future rides.</p>

    <h2 class="text-xl pt-4 mb-3 font-semibold">Statistics page</h2>
    <p class="mb-4">The Statistics page provides insights into your riding habits and achievements. For me personally, it helps to track my progress and set new goals (as in: I want to ride more kilometers this month than the same month last year).</p>

    <h2 class="text-xl pt-4 mb-3 font-semibold">Configuration page</h2>
    <p class="mb-4">The Configuration page allows you to customize the application settings, such as the bikes you ride and other preferences. You can add, edit, and delete bikes, and you can also choose which columns to show in the Rides and Routes tables.<br><br>
    This page also includes a backup feature, which allows you to export your data as a SQL file. This is useful for creating backups of your data, or for transferring your data to another device. Note that the backup is currently limited to 10.000 records per table.
    </p>
    <br><br>

    <p class="font-semibold">Latest version: v{{ LatestVersion }} ({{ LatestVersionDate }})</p>
    <p class="font-semibold">First version: v0.9.0 (11 Feb 2026)</p>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { LatestVersion, LatestVersionDate } from '~~/version'

const isDark = ref(false)

onMounted(() => {
  isDark.value = document.documentElement.classList.contains('dark')
  const observer = new MutationObserver(() => {
    isDark.value = document.documentElement.classList.contains('dark')
  })
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
})
</script>
