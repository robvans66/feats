import { statSync } from 'node:fs'
import { join } from 'node:path'
import os from 'node:os'
import db from '../db/index'
import { LatestVersion } from '../../version'

function getFallbackDatabaseLastChangedAt(): string | null {
  try {
    const dbPath = join(os.homedir(), '.feats', 'feats.db')
    return statSync(dbPath).mtime.toISOString()
  } catch {
    return null
  }
}

function getAppLevelLastChangedAt(): string | null {
  const row = db
    .prepare("SELECT value FROM app_meta WHERE key='last_data_change_at' LIMIT 1")
    .get() as { value?: string } | undefined

  if (row?.value) return row.value
  return getFallbackDatabaseLastChangedAt()
}

export default defineEventHandler(async () => {
  try {
    const totalRides = (db.prepare('SELECT COUNT(*) as c FROM rides_table').get() as { c: number }).c
    const totalRoutes = (db.prepare('SELECT COUNT(*) as c FROM routes_table').get() as { c: number }).c

    return {
      version: LatestVersion,
      totalRides,
      totalRoutes,
      lastChangeAt: getAppLevelLastChangedAt()
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`Status API error: ${message}`)
    throw createError({ statusCode: 500, statusMessage: message })
  }
})