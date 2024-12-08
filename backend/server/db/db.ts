import { Cow } from '../../../frontend/src/apiClient'
import db from './connection'

// Query data from all time
export async function getAllCows() {
  return await db('device_positions')
    .orderBy('utc_timestamp', 'asc')
    .select('*')
}

// Query data at a specific timestamp
export async function getAllCowsByTime(timestamp: string) {
  return await db('device_positions')
    .where('utc_timestamp', timestamp)
    .orderBy('utc_timestamp', 'asc')
    .select('*')
}

// Query data for a specific cow
export async function getCow(id: string) {
  return await db('device_positions')
    .where('cattle_name', id)
    // .orderBy('utc_timestamp', 'asc')
    .select('*')
}

// Query data for a specific cow at a specific timestamp
export async function getCowByTime(id: string, timestamp: string) {
  return await db('device_positions')
    .where('cattle_name', id)
    .andWhere('utc_timestamp', timestamp)
    .orderBy('utc_timestamp', 'asc')
    .select('*')
}
