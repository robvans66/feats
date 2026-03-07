import { d as defineEventHandler, r as readBody, c as createError } from '../../nitro/nitro.mjs';
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

function getDefaults() {
  return {
    bikeOptions: ["Santos", "Rimonta", "Gazelle", "Wahoo"],
    surfaceOptions: ["Road", "Gravel", "Road/Gravel", "Gravel/MTB"],
    pageSizeOptions: [5, 10, 20],
    ridesColumnVisibility: {
      id: true,
      date: true,
      description: true,
      distance: true,
      average: true,
      grade: true,
      bike: true,
      reference: true,
      link: true,
      notes: true
    },
    routesColumnVisibility: {
      id: true,
      description: true,
      distance: true,
      grade: true,
      start: true,
      destination: true,
      surface: true,
      reference: true,
      link: true,
      notes: true
    }
  };
}
function normalizeVisibility(keys, input, fallback) {
  var _a;
  const result = {};
  const source = typeof input === "object" && input !== null ? input : fallback;
  for (const key of keys) {
    const value = source[key];
    result[key] = typeof value === "boolean" ? value : (_a = fallback[key]) != null ? _a : true;
  }
  return result;
}
function normalizeConfig(input) {
  const defaults = getDefaults();
  const bikeOptions = Array.isArray(input.bikeOptions) ? input.bikeOptions.map((value) => String(value).trim()).filter(Boolean) : defaults.bikeOptions;
  const surfaceOptions = Array.isArray(input.surfaceOptions) ? input.surfaceOptions.map((value) => String(value).trim()).filter(Boolean) : defaults.surfaceOptions;
  const pageSizeOptions = Array.isArray(input.pageSizeOptions) ? input.pageSizeOptions.map((value) => Number(value)).filter((value) => Number.isFinite(value) && value > 0) : defaults.pageSizeOptions;
  const ridesKeys = Object.keys(defaults.ridesColumnVisibility);
  const routesKeys = Object.keys(defaults.routesColumnVisibility);
  return {
    bikeOptions: bikeOptions.length ? bikeOptions : defaults.bikeOptions,
    surfaceOptions: surfaceOptions.length ? surfaceOptions : defaults.surfaceOptions,
    pageSizeOptions: pageSizeOptions.length ? pageSizeOptions : defaults.pageSizeOptions,
    ridesColumnVisibility: normalizeVisibility(ridesKeys, input.ridesColumnVisibility, defaults.ridesColumnVisibility),
    routesColumnVisibility: normalizeVisibility(routesKeys, input.routesColumnVisibility, defaults.routesColumnVisibility)
  };
}
function parseJson(value, fallback) {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}
const config = defineEventHandler(async (event) => {
  try {
    const method = event.node.req.method;
    if (method === "GET") {
      const row = db.prepare("SELECT bike_options, surface_options, page_size_options, rides_column_visibility, routes_column_visibility FROM user_config WHERE id=1").get();
      const defaults = getDefaults();
      return {
        bikeOptions: parseJson(row == null ? void 0 : row.bike_options, defaults.bikeOptions),
        surfaceOptions: parseJson(row == null ? void 0 : row.surface_options, defaults.surfaceOptions),
        pageSizeOptions: parseJson(row == null ? void 0 : row.page_size_options, defaults.pageSizeOptions),
        ridesColumnVisibility: parseJson(
          row == null ? void 0 : row.rides_column_visibility,
          defaults.ridesColumnVisibility
        ),
        routesColumnVisibility: parseJson(
          row == null ? void 0 : row.routes_column_visibility,
          defaults.routesColumnVisibility
        )
      };
    }
    if (method === "PUT") {
      const body = await readBody(event);
      const next = normalizeConfig(body || {});
      const exists = db.prepare("SELECT COUNT(*) as c FROM user_config WHERE id=1").get().c;
      if (exists > 0) {
        db.prepare(
          "UPDATE user_config SET bike_options=?, surface_options=?, page_size_options=?, rides_column_visibility=?, routes_column_visibility=? WHERE id=1"
        ).run(
          JSON.stringify(next.bikeOptions),
          JSON.stringify(next.surfaceOptions),
          JSON.stringify(next.pageSizeOptions),
          JSON.stringify(next.ridesColumnVisibility),
          JSON.stringify(next.routesColumnVisibility)
        );
      } else {
        db.prepare(
          "INSERT INTO user_config (id, bike_options, surface_options, page_size_options, rides_column_visibility, routes_column_visibility) VALUES (1, ?, ?, ?, ?, ?)"
        ).run(
          JSON.stringify(next.bikeOptions),
          JSON.stringify(next.surfaceOptions),
          JSON.stringify(next.pageSizeOptions),
          JSON.stringify(next.ridesColumnVisibility),
          JSON.stringify(next.routesColumnVisibility)
        );
      }
      return next;
    }
    return { ok: false };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Config API error: ${message}`);
    throw createError({ statusCode: 500, statusMessage: message });
  }
});

export { config as default };
//# sourceMappingURL=config.mjs.map
