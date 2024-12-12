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
router.get('/', async (req, res, next) => {
  try {
    // Fetch all cow data of all times
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
    res.json(cowNames)
  } catch (error) {
    next(error)
  }
})

// GET /api/v1/cows/times
// early and late times for all cows
router.get('/times', async (req, res, next) => {
  try {
    const times = await getEarliestAndLatestTimes()
    res.json(times)
  } catch (error) {
    next(error)
  }
})

// --- SINGLE COW ---

// GET /api/v1/cows/173
router.get('/:id', async (req, res, next) => {
  try {
    // Fetch data for single cow of all times
    const cowData = await getCow(req.params.id)
    res.json(cowData)
  } catch (error) {
    next(error)
  }
})

export default router
