import { Cow } from '../../../frontend/src/apiClient'
import db from './connection'

export async function getCows() {
  return await db('device_positions').select('*')
}

export async function getCowById(id: string) {
  return await db('device_positions').where('cattle_name', id).select('*')
}

// Fetch data at a specific timestamp
export async function getCowsAtTimestamp(timestamp: Date) {
  return await db('device_positions')
    .select('*')
    .whereRaw(
      'DATE_FORMAT(utc_timestamp, "%Y-%m-%d %H:%i") = DATE_FORMAT(?, "%Y-%m-%d %H:%i")',
      [timestamp.toISOString()]
    )
}
