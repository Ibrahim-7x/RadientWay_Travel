// Inline SVG logo — a radiant compass star.
export default function Logo({ className = '' }) {
  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label="RadiantWay logo">
      <defs>
        <linearGradient id="logo-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e6b23a" />
          <stop offset="1" stopColor="#c4831f" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="30" fill="#0b1a2f" />
      <circle cx="32" cy="32" r="30" fill="none" stroke="url(#logo-g)" strokeWidth="2" opacity="0.6" />
      <path
        d="M32 12c3 8 8 13 16 16-8 3-13 8-16 16-3-8-8-13-16-16 8-3 13-8 16-16z"
        fill="url(#logo-g)"
      />
      <circle cx="45" cy="19" r="2.5" fill="#f3dd95" />
    </svg>
  )
}
