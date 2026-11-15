import express from 'express'
import { PRODUCTS } from './products.js'
import { shippingFor } from './shipping.js'

export const app = express()
app.use(express.json())

let nextOrder = 1042

app.get('/api/products', (_req, res) => {
  res.json(PRODUCTS)
})

app.get('/api/shipping', (req, res) => {
  res.json(shippingFor(req.query.postcode ?? ''))
})

app.post('/api/orders', (req, res) => {
  const { items = [], name, postcode } = req.body ?? {}
  if (!items.length) return res.status(400).json({ error: 'Your basket is empty.' })
  if (!name || !postcode) return res.status(400).json({ error: 'Name and postcode are required.' })

  const shipping = shippingFor(postcode)
  const order = { id: nextOrder++, name, postcode, items, shipping, placedAt: new Date().toISOString() }
  console.log(`Order #${order.id} placed (${items.length} items, ${shipping.zone})`)
  res.status(201).json(order)
})

// Errors come back as JSON so the front end (and your bug reports) can show them.
app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).json({ error: err.message })
})
