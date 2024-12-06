import { Router } from 'express'
import { getAllCows, getAllCowsByTime, getCow, getCowByTime } from '../db/db'

const router = Router()

// --- Single Cow
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

// --- All Cows:
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

export default router
