import Database from 'better-sqlite3'
import path from 'path'

const DB_PATH = path.resolve(process.cwd(), 'server/db/feats.db')

function init() {
  const db = new Database(DB_PATH)

  db.pragma('journal_mode = WAL')

  // rides-table
  db.prepare(`CREATE TABLE IF NOT EXISTS rides_table (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    description TEXT NOT NULL,
    distance REAL NOT NULL,
    average REAL,
    bike TEXT NOT NULL,
    reference TEXT,
    link TEXT,
    notes TEXT
  )`).run()

  // routes-table
  db.prepare(`CREATE TABLE IF NOT EXISTS routes_table (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    description TEXT NOT NULL,
    distance REAL NOT NULL,
    start TEXT NOT NULL,
    destination TEXT NOT NULL,
    surface TEXT NOT NULL,
    reference TEXT,
    link TEXT,
    notes TEXT
  )`).run()

  // seed if empty
  const rideCount = db.prepare('SELECT COUNT(*) as c FROM rides_table').get().c
  if (rideCount === 0) seed(db)

  const routeCount = db.prepare('SELECT COUNT(*) as c FROM routes_table').get().c
  if (routeCount === 0) seedRoutes(db)

  return db
}

function seed(db: Database) {
  const bikes = ['Santos', 'Rimonta', 'Gazelle', 'Wahoo']
  const insert = db.prepare(`INSERT INTO rides_table (date,description,distance,average,bike,reference,link,notes) VALUES (?,?,?,?,?,?,?,?)`)
  const years = [2026,2025,2024,2023]
  for (let i=0;i<20;i++){
    const year = years[i%years.length]
    const month = (i%12)+1
    const day = ((i*3)%27)+1
    const date = `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`
    const desc = `Ride ${i+1}`
    const distance = Math.round((20 + Math.random()*80)*10)/10
    const avg = Math.round((20 + Math.random()*10)*10)/10
    const bike = bikes[i % bikes.length]
    const reference = Math.random()>0.6 ? `https://example.com/ride/${i+1}` : null
    const link = reference ? 'Link' : null
    const notes = Math.random()>0.7 ? 'Nice ride' : ''
    insert.run(date,desc,distance,avg,bike,reference,link,notes)
  }
}

function seedRoutes(db: Database){
  const surfaces = ['Road','Gravel','Road/Gravel','Gravel/MTB']
  const insert = db.prepare(`INSERT INTO routes_table (description,distance,start,destination,surface,reference,link,notes) VALUES (?,?,?,?,?,?,?,?)`)
  for (let i=0;i<20;i++){
    const desc = `Route ${i+1}`
    const distance = Math.round((10 + Math.random()*120)*10)/10
    const start = `Start ${i+1}`
    const dest = `Destination ${i+1}`
    const surface = surfaces[i % surfaces.length]
    const reference = Math.random()>0.6 ? `https://example.com/route/${i+1}` : null
    const link = reference ? 'Link' : null
    const notes = Math.random()>0.7 ? 'Scenic' : ''
    insert.run(desc,distance,start,dest,surface,reference,link,notes)
  }
}

const db = init()
export default db
