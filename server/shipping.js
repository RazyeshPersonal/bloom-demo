// Shipping rates by postcode area (UK-style postcodes).
export const ZONES = {
  London: { rate: 3.95, days: 1 },
  South: { rate: 4.95, days: 2 },
  North: { rate: 5.95, days: 2 },
  Scotland: { rate: 7.95, days: 3 },
}

const AREA_TO_ZONE = {
  E: 'London', EC: 'London', N: 'London', NW: 'London', SE: 'London', SW: 'London', W: 'London', WC: 'London',
  BN: 'South', BS: 'South', GU: 'South', OX: 'South', RG: 'South', SO: 'South',
  LS: 'North', M: 'North', NE: 'North', S: 'North', YO: 'North',
  AB: 'Scotland', EH: 'Scotland', G: 'Scotland', IV: 'Scotland',
}

// Outward code: area letters + district, e.g. "SW1A" or "M1".
const OUTWARD = /^([A-Z]{1,2})\d[A-Z\d]?$/

export function normalizePostcode(postcode) {
  return String(postcode).trim().toUpperCase()
}

// The outward code is everything except the last three characters (the inward code).
export function outwardCode(postcode) {
  return postcode.slice(0, postcode.length - 3)
}

export function shippingFor(postcode) {
  const outward = outwardCode(normalizePostcode(postcode))
  const [, area] = outward.match(OUTWARD)
  const zone = ZONES[AREA_TO_ZONE[area]] ?? ZONES.South
  return { zone: AREA_TO_ZONE[area] ?? 'South', rate: zone.rate, days: zone.days }
}
