import db from './connection'

export async function getCows() {
  return await db('device_positions').select('*')
}

export async function getCowById(id: string) {
  return await db('device_positions').where('cattle_name', id).select('*')
}
