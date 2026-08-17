// Unsplash helper — builds an optimised CDN URL from a photo id.
export const img = (id, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`

// Unsplash renders any width from the same photo id, so a srcset lets the
// browser pick by viewport instead of every phone downloading the desktop
// image. Returns undefined for admin-uploaded URLs that carry no w= param —
// those are served at whatever single size they were uploaded at.
export const imgSrcSet = (src) =>
  /[?&]w=\d+/.test(src || '')
    ? [480, 768, 1200, 1920]
        .map((w) => `${src.replace(/([?&]w=)\d+/, `$1${w}`)} ${w}w`)
        .join(', ')
    : undefined

// Umrah packages live on their own /umrah page, tours on /tours. `category` is
// the source of truth; the tag check keeps rows saved before the field existed
// (and anything the admin only tagged) on the right page.
export const isUmrahPackage = (p) =>
  p?.category === 'umrah' ||
  (Array.isArray(p?.tags) && p.tags.some((t) => String(t).toLowerCase() === 'umrah'))

// Detail pages are namespaced per category so the right nav tab stays active.
export const packagePath = (p) => `${isUmrahPackage(p) ? '/umrah' : '/tours'}/${p.slug}`

