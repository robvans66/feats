import db from '../db/index'

const touchLastDataChange = db.prepare(
  `INSERT INTO app_meta (key, value)
   VALUES ('last_data_change_at', ?)
   ON CONFLICT(key) DO UPDATE SET value=excluded.value`
)

export default defineEventHandler(async (event) => {
  try {
    const method = event.node.req.method
    if (method === 'GET') {
      const q = getQuery(event)
      const page = Number(q.page || 0)
      const pageSize = Number(q.pageSize || 10)
      const filter = (q.filter || '').toString()
      const sortBy = (q.sortBy || 'description').toString()
      const sortDir = ((q.sortDir || 'asc') as string).toUpperCase() === 'ASC' ? 'ASC' : 'DESC'

      const where = filter ? "WHERE description LIKE @f OR start LIKE @f OR destination LIKE @f OR notes LIKE @f" : ''
      const countStmt = db.prepare(`SELECT COUNT(*) as c FROM routes_table ${where}`)
      const total = filter ? countStmt.get({ f: `%${filter}%` }).c : countStmt.get().c

      const stmt = db.prepare(`SELECT * FROM routes_table ${where} ORDER BY ${sortBy} ${sortDir} LIMIT @limit OFFSET @offset`)
      const rows = stmt.all({ f: `%${filter}%`, limit: pageSize, offset: page * pageSize })
      return { rows, total }
    }

    if (method === 'POST') {
      const body = await readBody(event)
      const stmt = db.prepare('INSERT INTO routes_table (description,distance,grade,start,destination,surface,reference,link,notes) VALUES (?,?,?,?,?,?,?,?,?)')
      const info = stmt.run(body.description, body.distance, body.grade ?? null, body.start, body.destination, body.surface, body.reference ?? null, body.link ?? null, body.notes ?? null)
      touchLastDataChange.run(new Date().toISOString())
      return { id: info.lastInsertRowid }
    }

    if (method === 'PUT') {
      const body = await readBody(event)
      const stmt = db.prepare('UPDATE routes_table SET description=?,distance=?,grade=?,start=?,destination=?,surface=?,reference=?,link=?,notes=? WHERE id=?')
      const info = stmt.run(body.description, body.distance, body.grade ?? null, body.start, body.destination, body.surface, body.reference ?? null, body.link ?? null, body.notes ?? null, body.id)
      if (info.changes > 0) {
        touchLastDataChange.run(new Date().toISOString())
      }
      return { ok: true }
    }

    if (method === 'DELETE') {
      const { id } = getQuery(event)
      if (!id) return { ok: false }
      const info = db.prepare('DELETE FROM routes_table WHERE id=?').run(Number(id))
      if (info.changes > 0) {
        touchLastDataChange.run(new Date().toISOString())
      }
      return { ok: true }
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`Routes API error: ${message}`)
    throw createError({ statusCode: 500, statusMessage: message })
  }
})
