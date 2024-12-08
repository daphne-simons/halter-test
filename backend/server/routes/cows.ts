import { Router } from 'express'
import {
  getAllCowNames,
  getAllCows,
  getAllCowsByTime,
  getCow,
  getCowByTime,
  getEarliestAndLatestTimeByCowId,
  getEarliestAndLatestTimes,
} from '../db/db'

const router = Router()

// --- ALL COWS ---
// GET /api/v1/cows
// or
// GET /api/v1/cows/?timestamp=2024-10-31 14:07:52.000
router.get('/', async (req, res, next) => {
  const { timestamp } = req.query
  try {
    // Fetch data for a specific time
    if (timestamp && typeof timestamp === 'string') {
      const cowsData = await getAllCowsByTime(timestamp)
      res.json(cowsData)
    }
    // Fetch all data of all times
    const cowsData = await getAllCows()
    res.json(cowsData)
  } catch (error) {
    next(error)
  }
})

// GET /api/v1/cows/names
router.get('/names', async (req, res, next) => {
  try {
    const cowNames = await getAllCowNames()
    // TODO: do this sort in the front end for a drop down display?
    // Because i want to use the real data to then queyr cowById via params.
    const orderedCowNames = cowNames
      .map((cow) => Number(cow.cattle_name))
      .sort((a, b) => a - b)
    // console.log('route ordered names', orderedCowNames)

    res.json(cowNames)
  } catch (error) {
    next(error)
  }
})
// GET early and late times for a single cow
router.get('/times', async (req, res, next) => {
  try {
    const times = await getEarliestAndLatestTimes()
    console.log('route Alltimes', times)

    res.json(times)
  } catch (error) {
    next(error)
  }
})

// --- SINGLE COW ---

// GET early and late times for a single cow
router.get('/times/:id', async (req, res, next) => {
  try {
    const times = await getEarliestAndLatestTimeByCowId(req.params.id)
    console.log('route times', times)

    res.json(times)
  } catch (error) {
    next(error)
  }
})

// GET /api/v1/cows/173
// or
// GET /api/v1/cows/173?timestamp=2024-10-31 14:07:52.000
router.get('/:id', async (req, res, next) => {
  const { timestamp } = req.query
  try {
    // Fetch data for a specific time
    if (timestamp && typeof timestamp === 'string') {
      const cowData = await getCowByTime(req.params.id, timestamp)
      res.json(cowData)
    }
    // Fetch data for single cow of all times
    const cowData = await getCow(req.params.id)
    res.json(cowData)
  } catch (error) {
    next(error)
  }
})

export default router
