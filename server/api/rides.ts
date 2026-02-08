import db from '../db/index'

export default defineEventHandler(async (event) => {
  const method = event.node.req.method
  if (method === 'GET') {
    const q = getQuery(event)
    const page = Number(q.page || 0)
    const pageSize = Number(q.pageSize || 10)
    const filter = (q.filter || '').toString()
    const sortBy = (q.sortBy || 'date').toString()
    const sortDir = ((q.sortDir || 'desc') as string).toUpperCase() === 'ASC' ? 'ASC' : 'DESC'

    // build where clause for basic global filter (search in description or notes)
    const where = filter ? "WHERE description LIKE @f OR notes LIKE @f" : ''
    const countStmt = db.prepare(`SELECT COUNT(*) as c FROM rides_table ${where}`)
    const total = filter ? countStmt.get({ f: `%${filter}%` }).c : countStmt.get().c

    const stmt = db.prepare(`SELECT * FROM rides_table ${where} ORDER BY ${sortBy} ${sortDir} LIMIT @limit OFFSET @offset`)
    const rows = stmt.all({ f: `%${filter}%`, limit: pageSize, offset: page * pageSize })
    return { rows, total }
  }

  if (method === 'POST') {
    const body = await readBody(event)
    const stmt = db.prepare('INSERT INTO rides_table (date,description,distance,average,grade,bike,reference,link,notes) VALUES (?,?,?,?,?,?,?,?,?)')
    const info = stmt.run(body.date, body.description, body.distance, body.average ?? null, body.grade ?? null, body.bike, body.reference ?? null, body.link ?? null, body.notes ?? null)
    return { id: info.lastInsertRowid }
  }

  if (method === 'PUT') {
    const body = await readBody(event)
    const stmt = db.prepare('UPDATE rides_table SET date=?,description=?,distance=?,average=?,grade=?,bike=?,reference=?,link=?,notes=? WHERE id=?')
    stmt.run(body.date, body.description, body.distance, body.average ?? null, body.grade ?? null, body.bike, body.reference ?? null, body.link ?? null, body.notes ?? null, body.id)
    return { ok: true }
  }

  if (method === 'DELETE') {
    const { id } = getQuery(event)
    if (!id) return { ok: false }
    db.prepare('DELETE FROM rides_table WHERE id=?').run(Number(id))
    return { ok: true }
  }
})
