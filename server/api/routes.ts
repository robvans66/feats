import db from '../db/index'

function parseNumericFilter(val: string): { clause: string; params: number[] } | null {
  const rangeMatch = val.match(/^(\d+(?:\.\d+)?)-(\d+(?:\.\d+)?)$/)
  if (rangeMatch) return { clause: 'BETWEEN ? AND ?', params: [Number(rangeMatch[1]), Number(rangeMatch[2])] }
  const compMatch = val.match(/^([><]=?)(\d+(?:\.\d+)?)$/)
  if (compMatch) return { clause: `${compMatch[1]} ?`, params: [Number(compMatch[2])] }
  const numMatch = val.match(/^\d+(?:\.\d+)?$/)
  if (numMatch) return { clause: '= ?', params: [Number(val)] }
  return null
}

export default defineEventHandler(async (event) => {
  try {
    if (!db) {
      throw new Error('Database is not available')
    }

    const method = event.node.req.method
    if (method === 'GET') {
      const q = getQuery(event)
      const page = Number(q.page || 0)
      const pageSize = Number(q.pageSize || 10)
      const sortBy = (q.sortBy || 'description').toString()
      const sortDir = ((q.sortDir || 'asc') as string).toUpperCase() === 'ASC' ? 'ASC' : 'DESC'

      const conditions: string[] = []
      const bindParams: any[] = []

      const hasAdvanced = Object.keys(q).some(k => k.startsWith('adv_'))
      if (hasAdvanced) {
        const numericCols = new Set(['distance', 'grade'])
        const allowedCols = new Set(['id', 'description', 'distance', 'grade', 'start', 'destination', 'surface', 'reference', 'link', 'notes'])
        for (const key of Object.keys(q)) {
          if (!key.startsWith('adv_')) continue
          const col = key.slice(4)
          if (!allowedCols.has(col)) continue
          const val = (q[key] || '').toString().trim()
          if (!val) continue
          if (numericCols.has(col)) {
            const parsed = parseNumericFilter(val)
            if (parsed) {
              conditions.push(`${col} ${parsed.clause}`)
              bindParams.push(...parsed.params)
            }
          } else {
            conditions.push(`${col} LIKE ?`)
            bindParams.push(`%${val}%`)
          }
        }
      } else {
        const filter = (q.filter || '').toString()
        const filterCol = (q.filterCol || 'all').toString()
        if (filter) {
          if (filterCol === 'description') { conditions.push('description LIKE ?'); bindParams.push(`%${filter}%`) }
          else if (filterCol === 'distance') { conditions.push('CAST(distance AS TEXT) LIKE ?'); bindParams.push(`%${filter}%`) }
          else if (filterCol === 'start') { conditions.push('start LIKE ?'); bindParams.push(`%${filter}%`) }
          else if (filterCol === 'destination') { conditions.push('destination LIKE ?'); bindParams.push(`%${filter}%`) }
          else if (filterCol === 'notes') { conditions.push('notes LIKE ?'); bindParams.push(`%${filter}%`) }
          else {
            conditions.push('(description LIKE ? OR start LIKE ? OR destination LIKE ? OR notes LIKE ? OR CAST(distance AS TEXT) LIKE ?)')
            bindParams.push(`%${filter}%`, `%${filter}%`, `%${filter}%`, `%${filter}%`, `%${filter}%`)
          }
        }
      }

      const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
      const countStmt = db.prepare(`SELECT COUNT(*) as c FROM routes_table ${where}`)
      const total = (bindParams.length ? (countStmt.get(...bindParams) as any) : (countStmt.get() as any)).c

      const stmt = db.prepare(`SELECT * FROM routes_table ${where} ORDER BY ${sortBy} ${sortDir} LIMIT ? OFFSET ?`)
      const rows = stmt.all(...bindParams, pageSize, page * pageSize) as any[]
      return { rows, total }
    }

    if (method === 'POST') {
      const body = await readBody(event)
      const stmt = db.prepare('INSERT INTO routes_table (description,distance,grade,start,destination,surface,reference,link,notes) VALUES (?,?,?,?,?,?,?,?,?)')
      const info = stmt.run(body.description, body.distance, body.grade ?? null, body.start, body.destination, body.surface, body.reference ?? null, body.link ?? null, body.notes ?? null)
      db.prepare(`INSERT INTO app_meta (key, value) VALUES ('last_data_change_at', ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value`).run(new Date().toISOString())
      return { id: info.lastInsertRowid }
    }

    if (method === 'PUT') {
      const body = await readBody(event)
      const stmt = db.prepare('UPDATE routes_table SET description=?,distance=?,grade=?,start=?,destination=?,surface=?,reference=?,link=?,notes=? WHERE id=?')
      const info = stmt.run(body.description, body.distance, body.grade ?? null, body.start, body.destination, body.surface, body.reference ?? null, body.link ?? null, body.notes ?? null, body.id)
      if (info.changes > 0) {
        db.prepare(`INSERT INTO app_meta (key, value) VALUES ('last_data_change_at', ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value`).run(new Date().toISOString())
      }
      return { ok: true }
    }

    if (method === 'DELETE') {
      const { id } = getQuery(event)
      if (!id) return { ok: false }
      const info = db.prepare('DELETE FROM routes_table WHERE id=?').run(Number(id))
      if (info.changes > 0) {
        db.prepare(`INSERT INTO app_meta (key, value) VALUES ('last_data_change_at', ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value`).run(new Date().toISOString())
      }
      return { ok: true }
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`Routes API error: ${message}`)
    throw createError({ statusCode: 500, statusMessage: message })
  }
})
