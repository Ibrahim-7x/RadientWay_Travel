/**
 * Infinite horizontal marquee. Duplicates children so the loop is seamless.
 * Pauses on hover.
 */
export default function Marquee({ children, className = '', reverse = false }) {
  return (
    <div className={`group relative flex overflow-hidden ${className}`}>
      <div
        className={`flex shrink-0 items-stretch gap-4 pr-4 animate-marquee group-hover:[animation-play-state:paused] ${
          reverse ? '[animation-direction:reverse]' : ''
        }`}
      >
        {children}
        {children}
      </div>
    </div>
  )
}
