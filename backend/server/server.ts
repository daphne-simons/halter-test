import express from 'express'

const server = express()

server.use(express.json())

server.get('/', (req, res) => {
  res.send('Hello Cows!')
})

export default server
