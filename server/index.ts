import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'

dotenv.config()

const app = express()
const port = process.env.PORT || 3001
const prisma = new PrismaClient()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hotel Digital Menu API is running. Access the frontend at http://localhost:3000')
})

app.get('/health', (req, res) => {
  res.json({ status: 'ok', database: 'connected' })
})

// Basic API route example
app.get('/api/items', async (req, res) => {
  try {
    const items = await prisma.menuItem.findMany({
      include: { category: true }
    })
    res.json(items)
  } catch (error) {
    console.error('Fetch items error:', error)
    res.status(500).json({ error: 'Failed to fetch items' })
  }
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
