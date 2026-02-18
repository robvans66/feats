<template>
  <section class="max-w-3xl mx-auto px-4 py-8">
    <h1 class="text-2xl pt-8 font-semibold mb-3">About Feats</h1>
    <div class="flex items-start gap-4">
      <p class="mb-4 flex-1">Feats is a small Nuxt application to keep track of completed bicycle rides and planned bicycle routes.
        <br><br>
        It is a personal project to learn more about Nuxt, and to have a simple tool to keep track of my rides and routes. It is not intended to be a full-featured application, but rather a simple and easy-to-use tool for myself and anyone else who might find it useful.<br><br>
        And let's be honest, this project is for 90% or more written by ChatGPT, with me, the mortal human with limited capabilities, providing the prompts and doing some light editing here and there.<br><br>
        The name "Feats" is a play on words, as it can refer to both "feats" as in achievements (completing rides and routes), and "fiets" which is the Dutch word for bicycle, pronounced similarly.<br><br>
        At least the name was fully made up by me, without any help from ChatGPT, so I can claim that as my own original contribution to the project.
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

    <h2 class="text-xl pt-4 mb-3 font-semibold">Rides page</h2>

    <h2 class="text-xl pt-4 mb-3 font-semibold">Routes page</h2>

    <h2 class="text-xl pt-4 mb-3 font-semibold">Statistics page</h2>

    <h2 class="text-xl pt-4 mb-3 font-semibold">Configuration page</h2>

    <h2 class="text-xl pt-4 mb-3 font-semibold">About page</h2>

    <h2 class="text-2xl pt-8 mb-3 font-semibold">Version History</h2>
    <h3 class="font-semibold">v1.0.2, 18-02-2026</h3>
    <ul class="mb-4 list-disc list-inside">
      <li>Added table 'Rides over 100km' on the Statistics page</li>
      <li>Enabled multiple selection in Rides and Routes tables for bulk deletion</li>
      <li>Fixed some dark mode contrast/color issues</li>
      <li>Updated logo for dark mode</li>
      <li>Some other minor improvements</li>
      </ul>
    <h3 class="font-semibold">v1.0.1, 14-02-2026</h3>
    <ul class="mb-4 list-disc list-inside">
      <li>Added 'Monthly Totals by Year' table on Statistics page</li>
      <li>Many small improvements and bug fixes</li>
    </ul>
    <h3 class="font-semibold mt-6">v1.0.0, 11-02-2026</h3>
    <ul class="mb-4 list-disc list-inside">
      <li>Initial version: Rides, Routes, Statistics, Configuration, About pages and SQLite backend for data storage</li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isDark = ref(false)

onMounted(() => {
  isDark.value = document.documentElement.classList.contains('dark')
  const observer = new MutationObserver(() => {
    isDark.value = document.documentElement.classList.contains('dark')
  })
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
})
</script>
