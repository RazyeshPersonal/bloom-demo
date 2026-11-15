import { describe, expect, it } from 'vitest'
import { cartTotals, money } from './cart.js'

const monstera = { id: 'monstera', name: 'Monstera Deliciosa', price: 24, qty: 1 }
const pothos = { id: 'pothos', name: 'Golden Pothos', price: 12.5, qty: 2 }

describe('cartTotals', () => {
  it('adds items and shipping with no code', () => {
    expect(cartTotals([monstera, pothos], '').total).toBe(52.95)
  })

  it('takes £15 off once with WELCOME15', () => {
    const totals = cartTotals([monstera], 'WELCOME15')
    expect(totals.discount).toBe(15)
    expect(totals.total).toBe(12.95)
  })

  it('charges nothing for an empty basket', () => {
    expect(cartTotals([], '').total).toBe(0)
  })
})

describe('money', () => {
  it('formats pounds', () => {
    expect(money(12.5)).toBe('£12.50')
  })
})
