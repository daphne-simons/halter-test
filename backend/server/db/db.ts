import db from './connection'

// Get all cow data
export async function getAllCows() {
  return await db('device_positions')
    .orderBy('utc_timestamp', 'asc')
    .select('*')
}

//  Earliest and latest times for all cows
export async function getEarliestAndLatestTimes() {
  return await db('device_positions')
    .select(
      db.raw(
        'MIN(utc_timestamp) as earliest_time, MAX(utc_timestamp) as latest_time'
      )
    )
    .whereNot('utc_timestamp', 'utc_timestamp') // Exclude rows where the timestamp is 'utc_timestamp'
    .first()
}

// Get all cow names
export async function getAllCowNames() {
  return await db('device_positions')
    .distinct('cattle_name') // just returns one of each - there are multiple entries per cow
    .whereNot('cattle_name', 'cattle_name') // Exclude rows where the timestamp is 'cattle_name'
    .select('cattle_name')
}

// Get cow data for a single cow
export async function getCow(id: string) {
  return await db('device_positions').where('cattle_name', id).select('*')
}
