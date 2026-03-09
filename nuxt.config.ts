// https://nuxt.com/docs/api/configuration/nuxt-config
import { build } from 'nuxt'

export default defineNuxtConfig({
  nitro: {
    output: {
      dir: '.output',
      serverDir: '.output/server',
      publicDir: 'dist'
    }
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/ui', 'nuxt-electron'],
  electron: {
    build: [ { entry: 'electron/main.ts' } ]
  },
  css: ['~/assets/css/main.css']
})
