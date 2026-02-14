<template>
  <section class="max-w-3xl mx-auto px-4 py-8">
    <h1 class="text-2xl pt-8 font-semibold mb-3">About Feats</h1>
    <div class="flex items-start gap-4">
      <p class="mb-4 flex-1">Feats is a small Nuxt application to keep track of completed bicycle rides and planned bicycle routes.
        <br><br>
        It is a personal project to learn more about Nuxt, and to have a simple tool to keep track of my rides and routes. It is not intended to be a full-featured application, but rather a simple and easy-to-use tool for myself and anyone else who might find it useful.
      </p>
      <img src="/feats.png" alt="Feats logo" class="w-32 h-32 flex-shrink-0">
    </div>


    <h1 class="text-2xl pt-8 font-semibold mb-3">Using Feats</h1>
    <p class="mb-4">Lorem ipsum dolor sit amet consectetur adipisicing elit. Est ex, at, architecto cum minima impedit harum, quasi velit hic laborum dolores modi tempore autem deserunt accusantium eligendi officia esse. Aperiam.</p>

    <h2 class="text-2xl pt-8 mb-3 font-semibold">Version History</h2>
    <ul class="list-disc ml-6">
    <li><strong>v1.0.1 <span class="mx-2">|</span> 14-02-2026</strong> — Added 'Monthly Totals by Year' statistic and many small improvements.</li>
    <li><strong>v1.0.0 <span class="mx-2">|</span> 11-02-2026</strong> — Initial version: Rides, Routes, Statistics, Configuration,About, SQLite backend.</li>
    </ul>
  </section>
</template>

<script setup lang="ts"></script>
