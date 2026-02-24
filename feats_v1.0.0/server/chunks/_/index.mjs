import Database from 'better-sqlite3';
import path from 'path';
import os from 'os';
import fs from 'fs';

const DB_DIR = path.join(os.homedir(), ".feats");
const DB_PATH = path.join(DB_DIR, "feats.db");
function init() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
  console.log(`Using database at: ${DB_PATH}`);
  const db2 = new Database(DB_PATH);
  db2.pragma("journal_mode = WAL");
  db2.prepare(`CREATE TABLE IF NOT EXISTS rides_table (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    description TEXT NOT NULL,
    distance REAL NOT NULL,
    average REAL,
    grade REAL,
    bike TEXT NOT NULL,
    reference TEXT,
    link TEXT,
    notes TEXT
  )`).run();
  db2.prepare(`CREATE TABLE IF NOT EXISTS routes_table (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    description TEXT NOT NULL,
    distance REAL NOT NULL,
    grade REAL,
    start TEXT NOT NULL,
    destination TEXT NOT NULL,
    surface TEXT NOT NULL,
    reference TEXT,
    link TEXT,
    notes TEXT
  )`).run();
  db2.prepare(`CREATE TABLE IF NOT EXISTS user_config (
    id INTEGER PRIMARY KEY,
    bike_options TEXT NOT NULL,
    surface_options TEXT NOT NULL,
    page_size_options TEXT NOT NULL,
    rides_column_visibility TEXT NOT NULL,
    routes_column_visibility TEXT NOT NULL
  )`).run();
  ensureColumn(db2, "rides_table", "grade", "REAL");
  ensureColumn(db2, "routes_table", "grade", "REAL");
  ensureColumn(db2, "user_config", "rides_column_visibility", "TEXT");
  ensureColumn(db2, "user_config", "routes_column_visibility", "TEXT");
  ensureUserConfig(db2);
  const rideCount = db2.prepare("SELECT COUNT(*) as c FROM rides_table").get().c;
  if (rideCount === 0) seed(db2);
  const routeCount = db2.prepare("SELECT COUNT(*) as c FROM routes_table").get().c;
  if (routeCount === 0) seedRoutes(db2);
  return db2;
}
function ensureUserConfig(db2) {
  const existing = db2.prepare("SELECT COUNT(*) as c FROM user_config").get().c;
  const defaults = getDefaultUserConfig();
  if (existing === 0) {
    db2.prepare("INSERT INTO user_config (id, bike_options, surface_options, page_size_options, rides_column_visibility, routes_column_visibility) VALUES (1, ?, ?, ?, ?, ?)").run(
      JSON.stringify(defaults.bikeOptions),
      JSON.stringify(defaults.surfaceOptions),
      JSON.stringify(defaults.pageSizeOptions),
      JSON.stringify(defaults.ridesColumnVisibility),
      JSON.stringify(defaults.routesColumnVisibility)
    );
  }
  db2.prepare(
    "UPDATE user_config SET bike_options=COALESCE(bike_options, ?), surface_options=COALESCE(surface_options, ?), page_size_options=COALESCE(page_size_options, ?), rides_column_visibility=COALESCE(rides_column_visibility, ?), routes_column_visibility=COALESCE(routes_column_visibility, ?) WHERE id=1"
  ).run(
    JSON.stringify(defaults.bikeOptions),
    JSON.stringify(defaults.surfaceOptions),
    JSON.stringify(defaults.pageSizeOptions),
    JSON.stringify(defaults.ridesColumnVisibility),
    JSON.stringify(defaults.routesColumnVisibility)
  );
}
function getDefaultUserConfig() {
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
function seed(db2) {
  const bikes = ["Santos", "Rimonta"];
  const insert = db2.prepare(`INSERT INTO rides_table (date,description,distance,average,grade,bike,reference,link,notes) VALUES (?,?,?,?,?,?,?,?,?)`);
  const years = [2026, 2025, 2024, 2023];
  for (let i = 0; i < 5; i++) {
    const year = years[i % years.length];
    const month = i % 12 + 1;
    const day = i * 3 % 27 + 1;
    const date = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const desc = `Ride ${i + 1}`;
    const distance = Math.round((20 + Math.random() * 80) * 10) / 10;
    const avg = Math.round((20 + Math.random() * 10) * 10) / 10;
    const grade = Math.round(Math.random() * 12 * 10) / 10;
    const bike = bikes[i % bikes.length];
    const reference = Math.random() > 0.6 ? `https://example.com/ride/${i + 1}` : null;
    const link = reference ? "Link" : null;
    const notes = Math.random() > 0.7 ? "Nice ride" : "";
    insert.run(date, desc, distance, avg, grade, bike, reference, link, notes);
  }
}
function seedRoutes(db2) {
  const surfaces = ["Road", "Gravel", "Road/Gravel", "Gravel/MTB"];
  const insert = db2.prepare(`INSERT INTO routes_table (description,distance,grade,start,destination,surface,reference,link,notes) VALUES (?,?,?,?,?,?,?,?,?)`);
  for (let i = 0; i < 3; i++) {
    const desc = `Route ${i + 1}`;
    const distance = Math.round((10 + Math.random() * 120) * 10) / 10;
    const grade = Math.round(Math.random() * 12 * 10) / 10;
    const start = `Start ${i + 1}`;
    const dest = `Destination ${i + 1}`;
    const surface = surfaces[i % surfaces.length];
    const reference = Math.random() > 0.6 ? `https://example.com/route/${i + 1}` : null;
    const link = reference ? "Link" : null;
    const notes = Math.random() > 0.7 ? "Scenic" : "";
    insert.run(desc, distance, grade, start, dest, surface, reference, link, notes);
  }
}
function ensureColumn(db2, table, column, type) {
  const columns = db2.prepare(`PRAGMA table_info(${table})`).all();
  const hasColumn = columns.some((col) => col.name === column);
  if (!hasColumn) {
    db2.prepare(`ALTER TABLE ${table} ADD COLUMN ${column} ${type}`).run();
  }
}
const db = init();

export { db as d };
//# sourceMappingURL=index.mjs.map
