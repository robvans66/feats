import { d as defineEventHandler, c as createError } from '../../nitro/nitro.mjs';
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

const stats = defineEventHandler(async () => {
  try {
    const yearTotals = db.prepare("SELECT strftime('%Y', date) as year, ROUND(SUM(distance),2) as distance, COUNT(*) as rides FROM rides_table GROUP BY year ORDER BY year DESC").all();
    const currentYear = (/* @__PURE__ */ new Date()).getFullYear().toString();
    const perBike = db.prepare("SELECT bike, ROUND(SUM(distance),2) as distance, COUNT(*) as rides FROM rides_table WHERE strftime('%Y',date)=? GROUP BY bike ORDER BY distance DESC").all(currentYear);
    const longestPerYear = db.prepare("SELECT strftime('%Y', date) as year, MAX(distance) as longest FROM rides_table GROUP BY year ORDER BY longest DESC").all();
    const monthlyTotals = db.prepare("SELECT strftime('%Y', date) as year, strftime('%m', date) as month, ROUND(SUM(distance),2) as distance, COUNT(*) as rides FROM rides_table GROUP BY year, month ORDER BY year DESC, month ASC").all();
    const ridesOver100km = db.prepare("SELECT strftime('%Y', date) as year, distance FROM rides_table WHERE distance > 100 ORDER BY year DESC, distance DESC").all();
    const ridesOver100ByYear = ridesOver100km.reduce((acc, ride) => {
      let yearEntry = acc.find((e) => e.year === ride.year);
      if (!yearEntry) {
        yearEntry = { year: ride.year, count: 0, distances: [] };
        acc.push(yearEntry);
      }
      yearEntry.count++;
      yearEntry.distances.push(ride.distance);
      return acc;
    }, []);
    return { yearTotals, perBike, longestPerYear, monthlyTotals, ridesOver100ByYear };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Stats API error: ${message}`);
    throw createError({ statusCode: 500, statusMessage: message });
  }
});

export { stats as default };
//# sourceMappingURL=stats.mjs.map
