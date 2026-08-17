// Link builders for phone / WhatsApp. The company details themselves come
// from the API (Setting table, "company" key) via ContentContext — every one
// of these takes that object as its first argument rather than closing over a
// hardcoded one, so the links follow whatever is set in Admin → Settings.

// Build a WhatsApp chat link against a company object, optionally prefilled.
export const waLinkFor = (co, text) =>
  text ? `${co.whatsapp}?text=${encodeURIComponent(text)}` : co.whatsapp

// The "please call me back" WhatsApp request behind every WhatsApp Call button.
// `about` narrows the message to a package; omit it for a general enquiry.
export const waCallLink = (co, about) =>
  waLinkFor(
    co,
    `Hi ${co.shortName || co.name}, please give me a call about ${about || 'my travel plans'}.`,
  )

// Turn a display phone number into a tel: href (keeps digits and leading +).
export const telHref = (phone) => `tel:${String(phone || '').replace(/[^\d+]/g, '')}`

