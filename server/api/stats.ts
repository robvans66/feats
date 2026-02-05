import db from '../db/index'

export default defineEventHandler(async () => {
  const yearTotals = db.prepare("SELECT strftime('%Y', date) as year, ROUND(SUM(distance),2) as distance, COUNT(*) as rides FROM rides_table GROUP BY year ORDER BY year DESC").all()

  const currentYear = new Date().getFullYear().toString()
  const perBike = db.prepare("SELECT bike, ROUND(SUM(distance),2) as distance, COUNT(*) as rides FROM rides_table WHERE strftime('%Y',date)=? GROUP BY bike ORDER BY distance DESC").all(currentYear)

  const longestPerYear = db.prepare("SELECT strftime('%Y', date) as year, MAX(distance) as longest FROM rides_table GROUP BY year ORDER BY longest DESC").all()

  return { yearTotals, perBike, longestPerYear }
})
