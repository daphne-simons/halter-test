import * as request from 'superagent'
export interface Cow {
  utc_timestamp: Date
  cattle_name: string
  latitude: number
  longitude: number
}
// Gets all cows data from all times
export async function getAllCows() {
  const res = await request.get('/api/v1/cows/')
  return res.body
}

// Gets single cow data from all times
export async function getSingleCow(id: string) {
  const res = await request.get(`/api/v1/cows/${id}`)
  return res.body
}

// Get earliest and latest time according to all cow data
export async function getAllTimes() {
  const res = await request.get('/api/v1/cows/times')
  return res.body
}

// Get earliest and latest time according to a single cow
export async function getSingleCowTimes(id: string) {
  const res = await request.get(`/api/v1/cows/times/${id}`)
  return res.body
}
