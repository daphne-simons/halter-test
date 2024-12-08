import { Cow } from '../../../frontend/src/apiClient'
import db from './connection'

// ----- ALL COWS -----
// Query data from all time
export async function getAllCows() {
  return await db('device_positions')
    .orderBy('utc_timestamp', 'asc')
    .select('*')
}

//  Query earliest and latest time for AllCows
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
// Query data at a specific timestamp
export async function getAllCowsByTime(timestamp: string) {
  return await db('device_positions')
    .where('utc_timestamp', timestamp)
    .orderBy('utc_timestamp', 'asc')
    .select('*')
}

// Query data to get ordered list of cowId's
export async function getAllCowNames() {
  return await db('device_positions')
    .distinct('cattle_name') // just returns one of each - there are multiple entries per cow
    .whereNot('cattle_name', 'cattle_name') // Exclude rows where the timestamp is 'utc_timestamp'
    .select('cattle_name')
}

// ----- SINGLE COW -----
// Query data for a specific cow
export async function getCow(id: string) {
  return await db('device_positions').where('cattle_name', id).select('*')
}
//  Query eraliest and latest time by CowId
export async function getEarliestAndLatestTimeByCowId(cowName: string) {
  return await db('device_positions')
    .select(
      db.raw(
        'MIN(utc_timestamp) as earliest_time, MAX(utc_timestamp) as latest_time'
      )
    )
    .where('cattle_name', cowName)
    .whereNot('utc_timestamp', 'utc_timestamp') // Exclude rows where the timestamp is 'utc_timestamp'
    .first()
}

// Query data for a specific cow at a specific timestamp
export async function getCowByTime(id: string, timestamp: string) {
  return await db('device_positions')
    .where('cattle_name', id)
    .andWhere('utc_timestamp', timestamp)
    .orderBy('utc_timestamp', 'asc')
    .select('*')
}
