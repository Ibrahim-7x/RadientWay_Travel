import { Star } from 'lucide-react'
import GoogleIcon from './GoogleIcon'
import { useGoogleRating } from '../../hooks/useGoogleRating'

// Live Google Reviews badge — rating, fractional stars and the review count,
// linking straight to the listing. Numbers come from the Places API when the
// server has a key, otherwise from Admin → Settings (see useGoogleRating).
export default function GoogleRating({ className = '' }) {
  const { rating, reviewCount, url, isLive } = useGoogleRating()

  if (!rating) return null

  // 4.7 → 94% of the star row painted gold, so the half star reads like Google's.
  const fillPct = Math.max(0, Math.min(100, (rating / 5) * 100))
  const stars = Array.from({ length: 5 })

  const label = `Rated ${rating.toFixed(1)} out of 5 from ${reviewCount} Google reviews`
  const Tag = url ? 'a' : 'div'
  const linkProps = url ? { href: url, target: '_blank', rel: 'noopener noreferrer' } : {}

  return (
    <Tag
      {...linkProps}
      aria-label={url ? `${label} — open our Google listing` : label}
      title={label}
      className={`group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-sm text-white backdrop-blur-md transition-colors duration-300 ${
        url ? 'hover:border-gold-400/50 hover:bg-white/15' : ''
      } ${className}`}
    >
      <GoogleIcon className="h-4 w-4 shrink-0" />

      <span className="font-semibold tabular-nums">{rating.toFixed(1)}</span>

      {/* Grey row underneath, gold row clipped to the rating on top. */}
      <span className="relative inline-flex" aria-hidden="true">
        <span className="flex">
          {stars.map((_, i) => (
            <Star key={i} className="h-3.5 w-3.5 shrink-0 fill-white/20 text-white/20" />
          ))}
        </span>
        <span
          className="absolute inset-y-0 left-0 flex overflow-hidden"
          style={{ width: `${fillPct}%` }}
        >
          {stars.map((_, i) => (
            <Star key={i} className="h-3.5 w-3.5 shrink-0 fill-gold-400 text-gold-400" />
          ))}
        </span>
      </span>

      <span className="whitespace-nowrap text-white/75">
        {reviewCount} Google reviews
      </span>

      {/* Only claim "live" when the number really came from Google. */}
      {isLive && (
        <span className="relative flex h-1.5 w-1.5 shrink-0" title="Updated live from Google">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
        </span>
      )}
    </Tag>
  )
}
