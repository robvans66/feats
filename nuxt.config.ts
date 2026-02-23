// https://nuxt.com/docs/api/configuration/nuxt-config
import { LatestVersion } from './version'

export default defineNuxtConfig({
  nitro: {
    output: {
      dir: `feats_${LatestVersion}`,
      serverDir: `feats_${LatestVersion}/server`,
      publicDir: `feats_${LatestVersion}/public`
    }
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/ui'],
  css: ['~/assets/css/main.css']
})
