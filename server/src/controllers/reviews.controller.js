import prisma from '../prisma.js'
import { asyncHandler } from '../middleware/error.js'
import { parseJson } from '../lib/json.js'

// Live Google rating for the hero badge.
//
// Reads the Places API (New) "place details" endpoint with a field mask, so we
// pay for the cheapest SKU (rating + review count only). Google's terms don't
// allow storing this, hence the short-lived in-memory cache instead of a DB row.
// Without GOOGLE_PLACES_API_KEY/GOOGLE_PLACE_ID — or if Google is down — we fall
// back to the rating saved in Admin → Settings, so the badge always renders.

const PLACES_URL = 'https://places.googleapis.com/v1/places'
const CACHE_TTL_MS = 6 * 60 * 60 * 1000 // 6h — Google's numbers move slowly
const REQUEST_TIMEOUT_MS = 6000
const COMPANY_KEY = 'company'

let cache = null // { at: epochMs, payload }

async function fetchFromGoogle() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  const placeId = process.env.GOOGLE_PLACE_ID
  if (!apiKey || !placeId) return null

  const res = await fetch(`${PLACES_URL}/${encodeURIComponent(placeId)}?languageCode=en`, {
    headers: {
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': 'rating,userRatingCount,googleMapsUri',
    },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`Google Places responded ${res.status}: ${body.slice(0, 300)}`)
  }

  const data = await res.json()
  if (typeof data.rating !== 'number') return null

  return {
    rating: data.rating,
    reviewCount: data.userRatingCount ?? 0,
    // googleMapsUri opens the listing; the ?...reviews suffix isn't documented,
    // so link to the listing itself and let the user tap through to reviews.
    url: data.googleMapsUri || null,
    source: 'google',
  }
}

async function fallbackFromSettings() {
  const row = await prisma.setting.findUnique({ where: { key: COMPANY_KEY } })
  const company = row ? parseJson(row.value, {}) : {}
  return {
    rating: Number(company.rating) || null,
    reviewCount: Number(company.reviewCount) || 0,
    url: company.reviewUrl || null,
    source: 'settings',
  }
}

// GET /api/reviews/google — public.
export const getGoogleRating = asyncHandler(async (_req, res) => {
  if (cache && Date.now() - cache.at < CACHE_TTL_MS) {
    return res.json({ ...cache.payload, cached: true })
  }

  let live = null
  try {
    live = await fetchFromGoogle()
  } catch (err) {
    // A rating badge is never worth a 500 — log and fall back.
    console.error('[reviews] Google Places lookup failed:', err.message)
  }

  const payload = { ...(live || (await fallbackFromSettings())), fetchedAt: new Date().toISOString() }

  // Only cache real Google data; settings can be edited in the admin panel and
  // should show up on the next request.
  if (live) cache = { at: Date.now(), payload }

  res.json({ ...payload, cached: false })
})
