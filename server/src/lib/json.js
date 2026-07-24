// Helpers for the JSON-string columns (gallery, tags, itinerary, …).
// On the way out of the DB we parse; on the way in we stringify.

export function parseJson(value, fallback = []) {
  if (value == null) return fallback
  if (typeof value !== 'string') return value
  try {
    return JSON.parse(value)
  } catch {
    return fallback
  }
}

export function stringifyJson(value, fallback = []) {
  if (value == null) return JSON.stringify(fallback)
  if (typeof value === 'string') {
    // Already a JSON string? keep it; otherwise wrap it.
    try {
      JSON.parse(value)
      return value
    } catch {
      return JSON.stringify(value)
    }
  }
  return JSON.stringify(value)
}

// Deserialise the given JSON-string fields on a record (or array of records).
export function deserialize(record, fields = []) {
  if (Array.isArray(record)) return record.map((r) => deserialize(r, fields))
  if (!record) return record
  const out = { ...record }
  for (const f of fields) out[f] = parseJson(out[f])
  return out
}

// Serialise the given fields on an input object into JSON strings.
export function serialize(input, fields = []) {
  const out = { ...input }
  for (const f of fields) {
    if (f in out) out[f] = stringifyJson(out[f])
  }
  return out
}
