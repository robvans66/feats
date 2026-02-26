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

const routes = defineEventHandler(async (event) => {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  try {
    const method = event.node.req.method;
    if (method === "GET") {
      const q = getQuery(event);
      const page = Number(q.page || 0);
      const pageSize = Number(q.pageSize || 10);
      const filter = (q.filter || "").toString();
      const sortBy = (q.sortBy || "description").toString();
      const sortDir = (q.sortDir || "asc").toUpperCase() === "ASC" ? "ASC" : "DESC";
      const where = filter ? "WHERE description LIKE @f OR start LIKE @f OR destination LIKE @f OR notes LIKE @f" : "";
      const countStmt = db.prepare(`SELECT COUNT(*) as c FROM routes_table ${where}`);
      const total = filter ? countStmt.get({ f: `%${filter}%` }).c : countStmt.get().c;
      const stmt = db.prepare(`SELECT * FROM routes_table ${where} ORDER BY ${sortBy} ${sortDir} LIMIT @limit OFFSET @offset`);
      const rows = stmt.all({ f: `%${filter}%`, limit: pageSize, offset: page * pageSize });
      return { rows, total };
    }
    if (method === "POST") {
      const body = await readBody(event);
      const stmt = db.prepare("INSERT INTO routes_table (description,distance,grade,start,destination,surface,reference,link,notes) VALUES (?,?,?,?,?,?,?,?,?)");
      const info = stmt.run(body.description, body.distance, (_a = body.grade) != null ? _a : null, body.start, body.destination, body.surface, (_b = body.reference) != null ? _b : null, (_c = body.link) != null ? _c : null, (_d = body.notes) != null ? _d : null);
      return { id: info.lastInsertRowid };
    }
    if (method === "PUT") {
      const body = await readBody(event);
      const stmt = db.prepare("UPDATE routes_table SET description=?,distance=?,grade=?,start=?,destination=?,surface=?,reference=?,link=?,notes=? WHERE id=?");
      stmt.run(body.description, body.distance, (_e = body.grade) != null ? _e : null, body.start, body.destination, body.surface, (_f = body.reference) != null ? _f : null, (_g = body.link) != null ? _g : null, (_h = body.notes) != null ? _h : null, body.id);
      return { ok: true };
    }
    if (method === "DELETE") {
      const { id } = getQuery(event);
      if (!id) return { ok: false };
      db.prepare("DELETE FROM routes_table WHERE id=?").run(Number(id));
      return { ok: true };
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Routes API error: ${message}`);
    throw createError({ statusCode: 500, statusMessage: message });
  }
});

export { routes as default };
//# sourceMappingURL=routes.mjs.map
