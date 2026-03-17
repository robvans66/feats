<template>
  <section class="max-w-3xl mx-auto px-4 py-8">
    <h1 class="text-2xl pt-8 font-semibold mb-1">Feats</h1>
    <h2 class="text-l mb-4 font-semibold">Keep track of your bicycle rides and planned routes</h2>
    <div class="flex items-start gap-4">
      <p class="mb-4 flex-1">Feats is a desktop application for keeping track of completed bicycle rides and planned bicycle routes.<br><br>
      It is not intended to be a full-featured app, but rather a simple and easy-to-use tool. Feats is particularly practical if you use multiple bicycle platforms and want an overview of all your rides and routes in one place. It's also useful if you don't use any platform at all and simply want to keep track of your rides and routes.<br><br>
      The extensive use of charts and statistics provides insights into your riding habits and achievements.<br><br>
      Feats is by no means a replacement for existing bicycle platforms. It is not a navigation app and not a social app, but rather a personal diary and statistics tool for your rides and routes. Everything is stored locally on your device.</p>

      <img src='/icon.png' alt="Feats application logo: a bicycle icon representing a simple desktop app for tracking rides and routes" class="w-32 h-32 shrink-0">
    </div>

    <h1 class="text-2xl pt-8 font-semibold mb-3">Using Feats</h1>
    <h2 class="text-xl pt-4 mb-3 font-semibold">Overview</h2>
    <p class="mb-4">Feats is designed to be simple and easy to use. You can add, edit, and delete rides and routes, view statistics, and configure the application to your liking. The application consists of five 'pages': Rides, Routes, Statistics, Settings, and Documentation.</p>
    <p class="mb-4">The Rides page allows you to keep track of your completed rides, including details such as date, distance, average speed, and notes. The Routes page is for planning future rides, where you can save the route name, distance, and notes. The Statistics page provides insights into your riding habits and achievements. The Settings page allows you to customize the application settings, such as the bikes you ride and other preferences.</p>
    <p class="mb-4">
      The application uses a local SQLite database to store your data, so all your rides and routes are stored locally on your device. When you start the application for the first time, it will create a new database and populate it with some sample data. You can then start playing around with Feats by adding, editing, and deleting rides and routes, and exploring the different statistic tables and charts of the application. 
    </p>

    <h2 class="text-xl pt-4 mb-3 font-semibold">Rides page</h2>
    <p class="mb-4">On the Rides page, you can add a new ride by filling out the form and clicking the 'Add' button. You can also edit a single existing ride or delete multiple existing rides.<br><br>
    On the Rides page, you can add a new ride by filling out the form and clicking the 'Add' button. You can also edit an existing ride or delete multiple rides at once.<br><br>
    In the 'Reference' field, you can add a URL to the route on an external bicycle platform such as RWGPS, Komoot, or Strava. In the 'Link' field, you can add a short text label that will appear as a clickable link.<br><br>
    In the 'Columns' section, you can choose which columns to display in the table, and you can sort the table by clicking on the column headers. Note that hidden columns, although not visible, are still included in searches.
    </p>

    <h2 class="text-xl pt-4 mb-3 font-semibold">Routes page</h2>
    <p class="mb-4">The Routes page is similar to the Rides page, but it is used for planning future rides.</p>

    <h2 class="text-xl pt-4 mb-3 font-semibold">Statistics page</h2>
    <p class="mb-4">The Statistics page provides insights into your riding habits and achievements. The page consists of two tabs: one with tables and one with charts. </p>

    <h2 class="text-xl pt-4 mb-3 font-semibold">Settings page</h2>
    <p class="mb-4">The 'Settings' page allows you to customize the application settings, such as the bikes you ride and other preferences. You can add, edit, and delete bikes, and you can also choose which columns to display in the Rides and Routes tables.<br><br>
    This page also includes a backup feature that allows you to export your data as a SQL file. This is useful for creating backups of your data or transferring it to another device.
    </p>
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
