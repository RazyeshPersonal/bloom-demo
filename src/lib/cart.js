export const DISCOUNTS = {
  WELCOME15: { type: 'fixed', amount: 15, label: '£15 off your first order' },
  SPRING10: { type: 'percent', amount: 10, label: '10% off' },
}

export const SHIPPING_ESTIMATE = 3.95

export function isValidCode(code) {
  return Boolean(DISCOUNTS[code?.trim().toUpperCase()])
}

export function applyDiscount(amount, code) {
  const discount = DISCOUNTS[code?.trim().toUpperCase()]
  if (!discount) return amount
  console.log(`Discount applied: ${code.trim().toUpperCase()}`)
  return discount.type === 'percent' ? amount * (1 - discount.amount / 100) : amount - discount.amount
}

export function itemsTotal(items) {
  return items.reduce((sum, item) => sum + item.price * item.qty, 0)
}

export function cartTotals(items, code, shipping = SHIPPING_ESTIMATE) {
  const itemsSum = itemsTotal(items)
  const subtotal = applyDiscount(itemsSum, code)
  const discount = itemsSum - subtotal
  const total = applyDiscount(subtotal, code) + (items.length ? shipping : 0)
  return { itemsSum, discount, subtotal, shipping: items.length ? shipping : 0, total: round(total) }
}

export function money(amount) {
  return `${amount < 0 ? '-' : ''}£${Math.abs(amount).toFixed(2)}`
}

function round(n) {
  return Math.round(n * 100) / 100
}
