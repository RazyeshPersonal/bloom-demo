import { describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from './app.js'
import { shippingFor } from './shipping.js'

describe('shippingFor', () => {
  it('finds the London zone', () => {
    expect(shippingFor('SW1A1AA')).toMatchObject({ zone: 'London', rate: 3.95 })
  })

  it('finds the Scotland zone', () => {
    expect(shippingFor('eh11yz')).toMatchObject({ zone: 'Scotland', rate: 7.95 })
  })
})

describe('POST /api/orders', () => {
  it('places an order', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({ name: 'Sam', postcode: 'M11AE', items: [{ id: 'fern', qty: 1 }] })
    expect(res.status).toBe(201)
    expect(res.body.shipping.zone).toBe('North')
  })

  it('rejects an empty basket', async () => {
    const res = await request(app).post('/api/orders').send({ name: 'Sam', postcode: 'M11AE', items: [] })
    expect(res.status).toBe(400)
  })
})
