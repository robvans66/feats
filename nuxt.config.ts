// https://nuxt.com/docs/api/configuration/nuxt-config
import { LatestVersion } from './version'

export default defineNuxtConfig({
  nitro: {
    output: {
      dir: `feats_v${LatestVersion}`,
      serverDir: `feats_v${LatestVersion}/server`,
      publicDir: `feats_v${LatestVersion}/public`
    }
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/ui'],
  css: ['~/assets/css/main.css']
})
