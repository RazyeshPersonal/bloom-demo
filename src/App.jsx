import { useEffect, useMemo, useState } from 'react'
import { cartTotals, isValidCode, money } from './lib/cart.js'

export default function App() {
  const [products, setProducts] = useState([])
  const [basket, setBasket] = useState([])
  const [codeInput, setCodeInput] = useState('')
  const [code, setCode] = useState('')
  const [codeError, setCodeError] = useState('')
  const [name, setName] = useState('')
  const [postcode, setPostcode] = useState('')
  const [status, setStatus] = useState({ state: 'idle' })

  useEffect(() => {
    fetch('/api/products')
      .then((r) => r.json())
      .then(setProducts)
      .catch(() => setProducts([]))
  }, [])

  const add = (product) =>
    setBasket((items) => {
      const found = items.find((i) => i.id === product.id)
      if (found) return items.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i))
      return [...items, { ...product, qty: 1 }]
    })

  const remove = (id) => setBasket((items) => items.filter((i) => i.id !== id))

  const applyCode = (e) => {
    e.preventDefault()
    if (isValidCode(codeInput)) {
      setCode(codeInput.trim().toUpperCase())
      setCodeError('')
    } else {
      setCodeError('That code isn’t valid.')
    }
  }

  const totals = useMemo(() => cartTotals(basket, code), [basket, code])

  const placeOrder = async (e) => {
    e.preventDefault()
    setStatus({ state: 'sending' })
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, postcode, code, items: basket.map(({ id, qty }) => ({ id, qty })) }),
      })
      const body = await res.json()
      if (!res.ok) throw new Error(body.error)
      setStatus({ state: 'done', order: body })
      setBasket([])
      setCode('')
      setCodeInput('')
    } catch (err) {
      console.error('Order failed:', err.message)
      setStatus({ state: 'error' })
    }
  }

  return (
    <div className="page">
      {import.meta.env.VITE_ENV_LABEL && <div className="env">{import.meta.env.VITE_ENV_LABEL}</div>}
      <header className="top">
        <div className="logo">
          <span className="leaf" aria-hidden>❦</span> Bloom &amp; Co
        </div>
        <nav>
          <a href="#shop">Shop</a>
          <a href="#basket">Basket ({basket.reduce((n, i) => n + i.qty, 0)})</a>
        </nav>
      </header>

      <section className="hero">
        <h1>Plants that forgive you.</h1>
        <p>Hardy houseplants, delivered in 1–3 days. New here? Use <b>WELCOME15</b> for £15 off.</p>
      </section>

      <main className="layout">
        <section id="shop" className="grid">
          {products.map((p) => (
            <article key={p.id} className="card">
              <div className="pot" style={{ background: p.color }} aria-hidden>
                <span>❦</span>
              </div>
              <h3>{p.name}</h3>
              <p className="blurb">{p.blurb}</p>
              <div className="row">
                <span className="price">{money(p.price)}</span>
                <button onClick={() => add(p)}>Add to basket</button>
              </div>
            </article>
          ))}
        </section>

        <aside id="basket" className="basket">
          <h2>Your basket</h2>
          {basket.length === 0 && status.state !== 'done' && <p className="muted">Nothing here yet.</p>}
          {status.state === 'done' && (
            <p className="ok">
              Thanks {status.order.name}! Order #{status.order.id} arrives in {status.order.shipping.days} day
              {status.order.shipping.days > 1 ? 's' : ''}.
            </p>
          )}
          <ul className="lines">
            {basket.map((i) => (
              <li key={i.id}>
                <span>
                  {i.qty} × {i.name}
                </span>
                <span>
                  {money(i.price * i.qty)}{' '}
                  <button className="link" onClick={() => remove(i.id)} aria-label={`Remove ${i.name}`}>
                    ✕
                  </button>
                </span>
              </li>
            ))}
          </ul>

          {basket.length > 0 && (
            <>
              <form className="code" onSubmit={applyCode}>
                <input
                  placeholder="Discount code"
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value)}
                  aria-label="Discount code"
                />
                <button type="submit">Apply</button>
              </form>
              {codeError && <p className="err">{codeError}</p>}

              <dl className="totals">
                <dt>Items</dt>
                <dd>{money(totals.itemsSum)}</dd>
                {code && (
                  <>
                    <dt>Discount ({code})</dt>
                    <dd>-{money(totals.discount)}</dd>
                  </>
                )}
                <dt>Shipping (estimate)</dt>
                <dd>{money(totals.shipping)}</dd>
                <dt className="grand">Total</dt>
                <dd className="grand">{money(totals.total)}</dd>
              </dl>

              <form className="checkout" onSubmit={placeOrder}>
                <h2>Checkout</h2>
                <label>
                  Name
                  <input value={name} onChange={(e) => setName(e.target.value)} required />
                </label>
                <label>
                  Postcode
                  <input value={postcode} onChange={(e) => setPostcode(e.target.value)} placeholder="SW1A 1AA" required />
                </label>
                <button className="primary" disabled={status.state === 'sending'}>
                  {status.state === 'sending' ? 'Placing order…' : `Place order · ${money(totals.total)}`}
                </button>
                {status.state === 'error' && <p className="err">Something went wrong. Please try again.</p>}
              </form>
            </>
          )}
        </aside>
      </main>

      <footer className="foot">Bloom &amp; Co is a demo shop for Flawsnap tutorials. Nothing here is for sale.</footer>
    </div>
  )
}
