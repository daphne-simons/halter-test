import * as request from 'superagent'
export interface Cow {
  utc_timestamp: Date
  cattle_name: string
  latitude: number
  longitude: number
}
export interface Name {
  cattle_name: string
}
// Gets all cows from all times
export async function getAllCows() {
  const res = await request.get('/api/v1/cows/')
  return res.body
}

// Gets all cow names
export async function getAllNames() {
  const res = await request.get('/api/v1/cows/names')
  return res.body as Name[]
}
// Gets single cow from all times
export async function getSingleCow(id: string) {
  const res = await request.get(`/api/v1/cows/${id}`)
  return res.body
}

// Gets earliest and latest time according to all cows
export async function getTimes() {
  const res = await request.get('/api/v1/cows/times')
  return res.body
}
