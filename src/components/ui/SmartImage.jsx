import { useState } from 'react'

/**
 * Image with a graceful gradient fallback so a broken/hotlinked stock photo
 * never shows a broken-image icon. While loading (or on error) a navy→gold
 * gradient with the alt label is shown instead.
 */
export default function SmartImage({ src, alt = '', className = '', imgClassName = '', label }) {
  const [status, setStatus] = useState('loading') // loading | loaded | error

  return (
    <div className={`relative overflow-hidden bg-navy-gradient ${className}`}>
      {/* Gradient placeholder / fallback layer */}
      <div
        className={`absolute inset-0 flex items-center justify-center bg-navy-gradient transition-opacity duration-700 ${
          status === 'loaded' ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <div className="absolute inset-0 opacity-40 bg-radiant-glow" />
        {label && (
          <span className="relative font-display text-lg font-semibold text-gold-200/90">
            {label}
          </span>
        )}
      </div>

      {status !== 'error' && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
          className={`h-full w-full object-cover transition-opacity duration-700 ${
            status === 'loaded' ? 'opacity-100' : 'opacity-0'
          } ${imgClassName}`}
        />
      )}
    </div>
  )
}
