import express from 'express'
import cows from './routes/cows'
const server = express()

server.use(express.json())

server.use('/api/v1/cows/', cows)
export default server
