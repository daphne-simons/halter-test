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

// TODO: Create API functions front and back to get cows and singleCow by Time.

export async function getCowsAtTimeStamp(timestamp: string) {
  const res = await request.get('/api/v1/cows/').query({ timestamp })

  return res.body
}
