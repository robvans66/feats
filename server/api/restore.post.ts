import db from '../db/index'

const ALLOWED_TABLES = ['rides_table', 'routes_table', 'user_config']

function validateSql(sql: string): string | null {
  const firstLine = sql.split('\n').find(l => l.trim())
  if (!firstLine?.trim().startsWith('-- Feats Backup')) {
    return 'Not a valid Feats backup file (missing header).'
  }

  const lower = sql.toLowerCase()
  for (const table of ALLOWED_TABLES) {
    if (!lower.includes(`create table ${table}`)) {
      return `Not a valid Feats backup file (missing table: ${table}).`
    }
  }

  if (/\battach\b/i.test(sql)) {
    return 'File contains a disallowed SQL command (ATTACH).'
  }

  const dropPattern = /DROP\s+TABLE\s+(?:IF\s+EXISTS\s+)?(\w+)/gi
  let match
  while ((match = dropPattern.exec(sql)) !== null) {
    if (!ALLOWED_TABLES.includes(match[1].toLowerCase())) {
      return `File attempts to drop an unexpected table: ${match[1]}.`
    }
  }

  return null
}

export default defineEventHandler(async (event) => {
  if (!db) throw createError({ statusCode: 500, statusMessage: 'Database not available.' })

  const body = await readBody(event)
  const sql = body?.sql

  if (typeof sql !== 'string' || !sql.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'No SQL content provided.' })
  }

  const error = validateSql(sql)
  if (error) throw createError({ statusCode: 400, statusMessage: error })

  try {
    db.transaction(() => { db.exec(sql) })()
    return { ok: true }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    throw createError({ statusCode: 500, statusMessage: `Restore failed: ${message}` })
  }
})
