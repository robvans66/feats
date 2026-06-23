import db from '../db/index'

const RIDES_COLUMNS = ['date', 'description', 'distance', 'average', 'grade', 'bike', 'reference', 'link', 'notes']
const ROUTES_COLUMNS = ['description', 'distance', 'grade', 'start', 'destination', 'surface', 'reference', 'link', 'notes']

export default defineEventHandler(async (event) => {
  if (!db) throw createError({ statusCode: 500, statusMessage: 'Database not available.' })

  const body = await readBody(event)
  const { table, rows } = body

  if (!['rides_table', 'routes_table'].includes(table)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid table name.' })
  }
  if (!Array.isArray(rows) || rows.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No rows to import.' })
  }

  const columns = table === 'rides_table' ? RIDES_COLUMNS : ROUTES_COLUMNS
  const placeholders = columns.map(() => '?').join(', ')
  const stmt = db.prepare(`INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})`)

  try {
    db.transaction((rowList: any[]) => {
      for (const row of rowList) {
        stmt.run(...columns.map(col => row[col] ?? null))
      }
    })(rows)
    return { ok: true, count: rows.length }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    throw createError({ statusCode: 500, statusMessage: `Import failed: ${message}` })
  }
})
