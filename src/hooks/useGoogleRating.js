import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { useContent } from '../context/ContentContext'

// Live Google rating, with the Admin → Settings values as the first paint and
// the offline fallback — same pattern as ContentContext, so the badge never
// flashes empty and still renders with the API down.
export function useGoogleRating() {
  const { company } = useContent()
  const [live, setLive] = useState(null)

  useEffect(() => {
    let alive = true
    api
      .get('/reviews/google', { auth: false })
      .then((data) => {
        if (alive && data && typeof data.rating === 'number') setLive(data)
      })
      .catch(() => {
        // Keep the settings fallback below.
      })
    return () => {
      alive = false
    }
  }, [])

  return {
    rating: Number(live?.rating ?? company.rating) || 0,
    reviewCount: Number(live?.reviewCount ?? company.reviewCount) || 0,
    url: live?.url || company.reviewUrl || null,
    isLive: live?.source === 'google',
  }
}
