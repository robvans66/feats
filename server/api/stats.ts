import db from '../db/index'

export default defineEventHandler(async () => {
  try {    if (!db) {
      throw new Error('Database is not available')
    }    const yearTotals = db.prepare("SELECT strftime('%Y', date) as year, ROUND(SUM(distance),2) as distance, COUNT(*) as rides FROM rides_table GROUP BY year ORDER BY year DESC").all()

    const currentYear = new Date().getFullYear().toString()
    const perBike = db.prepare("SELECT bike, ROUND(SUM(distance),2) as distance, COUNT(*) as rides FROM rides_table WHERE strftime('%Y',date)=? GROUP BY bike ORDER BY distance DESC").all(currentYear)

    const longestPerYear = db.prepare("SELECT strftime('%Y', date) as year, MAX(distance) as longest FROM rides_table GROUP BY year ORDER BY longest DESC").all()

    const highestAveragePerYear = db
      .prepare("SELECT strftime('%Y', date) as year, ROUND(MAX(average), 2) as highestAverage FROM rides_table WHERE average IS NOT NULL GROUP BY year ORDER BY year DESC")
      .all()

    const topAverageSpeedsPerYear = db
      .prepare(`
        WITH ranked AS (
          SELECT
            id,
            strftime('%Y', date) as year,
            date,
            description,
            bike,
            ROUND(distance, 2) as distance,
            ROUND(average, 2) as average,
            ROW_NUMBER() OVER (
              PARTITION BY strftime('%Y', date)
              ORDER BY average DESC, date DESC, id DESC
            ) as rank
          FROM rides_table
          WHERE average IS NOT NULL
        )
        SELECT id, year, rank, date, description, bike, distance, average
        FROM ranked
        WHERE rank <= 10
        ORDER BY year DESC, rank ASC
      `)
      .all()

    const monthlyTotals = db.prepare("SELECT strftime('%Y', date) as year, strftime('%m', date) as month, ROUND(SUM(distance),2) as distance, COUNT(*) as rides FROM rides_table GROUP BY year, month ORDER BY year DESC, month ASC").all()

    // Rides over 100km per year
    const ridesOver100km = db.prepare("SELECT strftime('%Y', date) as year, distance FROM rides_table WHERE distance > 100 ORDER BY year DESC, distance DESC").all() as Array<{ year: string, distance: number }>
    
    // Group by year and format distances
    const ridesOver100ByYear = ridesOver100km.reduce((acc: any[], ride) => {
      let yearEntry = acc.find(e => e.year === ride.year)
      if (!yearEntry) {
        yearEntry = { year: ride.year, count: 0, distances: [] }
        acc.push(yearEntry)
      }
      yearEntry.count++
      yearEntry.distances.push(ride.distance)
      return acc
    }, [])

    return {
      yearTotals,
      perBike,
      longestPerYear,
      highestAveragePerYear,
      topAverageSpeedsPerYear,
      monthlyTotals,
      ridesOver100ByYear
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`Stats API error: ${message}`)
    throw createError({ statusCode: 500, statusMessage: message })
  }
})
