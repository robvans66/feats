import { d as defineEventHandler, g as getQuery, r as readBody, c as createError } from '../../nitro/nitro.mjs';
import { d as db } from '../../_/index.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '@iconify/utils';
import 'consola';
import 'better-sqlite3';
import 'path';
import 'os';
import 'fs';

const rides = defineEventHandler(async (event) => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
  try {
    const method = event.node.req.method;
    if (method === "GET") {
      const q = getQuery(event);
      const page = Number(q.page || 0);
      const pageSize = Number(q.pageSize || 10);
      const filter = (q.filter || "").toString();
      const sortBy = (q.sortBy || "date").toString();
      const sortDir = (q.sortDir || "desc").toUpperCase() === "ASC" ? "ASC" : "DESC";
      const where = filter ? "WHERE description LIKE @f OR notes LIKE @f" : "";
      const countStmt = db.prepare(`SELECT COUNT(*) as c FROM rides_table ${where}`);
      const total = filter ? countStmt.get({ f: `%${filter}%` }).c : countStmt.get().c;
      const stmt = db.prepare(`SELECT * FROM rides_table ${where} ORDER BY ${sortBy} ${sortDir} LIMIT @limit OFFSET @offset`);
      const rows = stmt.all({ f: `%${filter}%`, limit: pageSize, offset: page * pageSize });
      return { rows, total };
    }
    if (method === "POST") {
      const body = await readBody(event);
      const stmt = db.prepare("INSERT INTO rides_table (date,description,distance,average,grade,bike,reference,link,notes) VALUES (?,?,?,?,?,?,?,?,?)");
      const info = stmt.run(body.date, body.description, body.distance, (_a = body.average) != null ? _a : null, (_b = body.grade) != null ? _b : null, body.bike, (_c = body.reference) != null ? _c : null, (_d = body.link) != null ? _d : null, (_e = body.notes) != null ? _e : null);
      return { id: info.lastInsertRowid };
    }
    if (method === "PUT") {
      const body = await readBody(event);
      const stmt = db.prepare("UPDATE rides_table SET date=?,description=?,distance=?,average=?,grade=?,bike=?,reference=?,link=?,notes=? WHERE id=?");
      stmt.run(body.date, body.description, body.distance, (_f = body.average) != null ? _f : null, (_g = body.grade) != null ? _g : null, body.bike, (_h = body.reference) != null ? _h : null, (_i = body.link) != null ? _i : null, (_j = body.notes) != null ? _j : null, body.id);
      return { ok: true };
    }
    if (method === "DELETE") {
      const { id } = getQuery(event);
      if (!id) return { ok: false };
      db.prepare("DELETE FROM rides_table WHERE id=?").run(Number(id));
      return { ok: true };
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Rides API error: ${message}`);
    throw createError({ statusCode: 500, statusMessage: message });
  }
});

export { rides as default };
//# sourceMappingURL=rides.mjs.map
