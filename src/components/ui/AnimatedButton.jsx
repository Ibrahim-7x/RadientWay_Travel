import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

/**
 * Button with a gold shine sweep on hover. Renders as a router Link (`to`),
 * an anchor (`href`), or a native button.
 */
export default function AnimatedButton({
  children,
  to,
  href,
  variant = 'gold',
  className = '',
  showArrow = false,
  ...rest
}) {
  const variantClass =
    variant === 'gold'
      ? 'btn-gold'
      : variant === 'navy'
      ? 'btn-navy'
      : 'btn-outline'

  const content = (
    <>
      <span className="pointer-events-none absolute inset-0 -z-0 overflow-hidden rounded-full">
        <span className="absolute top-0 left-0 h-full w-12 -translate-x-full bg-white/40 blur-md transition-transform duration-700 ease-out group-hover:translate-x-[220%]" />
      </span>
      <span className="relative z-10 flex items-center gap-2">
        {children}
        {showArrow && (
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        )}
      </span>
    </>
  )

  const classes = `group ${variantClass} ${className}`

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {content}
      </Link>
    )
  }
  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {content}
      </a>
    )
  }
  return (
    <button className={classes} {...rest}>
      {content}
    </button>
  )
}
