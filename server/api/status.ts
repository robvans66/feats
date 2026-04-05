import { existsSync, readdirSync, statSync } from 'node:fs'
import { basename, dirname, isAbsolute, join, sep } from 'node:path'
import os from 'node:os'
import db, { DB_PATH } from '../db/index'
import { LatestVersion } from '../../version'

function getFallbackDatabaseLastChangedAt(): string | null {
  try {
    const dbPath = join(os.homedir(), '.feats', 'feats.db')
    return statSync(dbPath).mtime.toISOString()
  } catch {
    return null
  }
}

function getDisplayDatabasePath(): string {
  if (existsSync(DB_PATH)) {
    try {
      return getPathWithActualCase(DB_PATH)
    } catch {
      return DB_PATH
    }
  }

  // Guard against occasional single-/User rendering on macOS.
  if (process.platform === 'darwin' && DB_PATH.startsWith('/User/')) {
    return DB_PATH.replace('/User/', '/Users/')
  }

  return DB_PATH
}

function getPathWithActualCase(filePath: string): string {
  if (!isAbsolute(filePath)) return filePath

  const normalized = filePath.startsWith('/User/')
    ? filePath.replace('/User/', '/Users/')
    : filePath

  const segments = normalized.split(sep).filter(Boolean)
  let currentPath = normalized.startsWith(sep) ? sep : ''

  for (const segment of segments) {
    const parentPath = currentPath || sep
    const entries = readdirSync(parentPath)
    const actualSegment = entries.find((entry) => entry.toLowerCase() === segment.toLowerCase()) || segment
    currentPath = currentPath === sep ? `${sep}${actualSegment}` : join(currentPath, actualSegment)
  }

  return currentPath
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
      lastChangeAt: getAppLevelLastChangedAt(),
      databasePath: getDisplayDatabasePath()
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`Status API error: ${message}`)
    throw createError({ statusCode: 500, statusMessage: message })
  }
})