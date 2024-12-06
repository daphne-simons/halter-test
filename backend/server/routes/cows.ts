import { Router } from 'express'
import { getCows, getCowById, getCowsAtTimestamp } from '../db/db'

const router = Router()

router.get('/', async (req, res, next) => {
  try {
    const cowsData = await getCows()
    res.json(cowsData)
  } catch (error) {
    next(error)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const cowsData = await getCowById(req.params.id)
    res.json(cowsData)
  } catch (error) {
    next(error)
  }
})

router.get('/', async (req, res, next) => {
  try {
    const { timestamp } = req.query
    // Fetch data for a specific timestamp
    const cowsData = await getCowsAtTimestamp(new Date(timestamp as string))
    res.json(cowsData)
  } catch (error) {
    next(error)
  }
})

export default router
