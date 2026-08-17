// Tiny fetch wrapper around the RadiantWay API.
// - Reads the base URL from VITE_API_URL, defaulting to same-origin /api.
// - Attaches the stored admin JWT to every request when present.
// - Throws an Error carrying the server's message + status on failure.

// Same-origin by default, which is right everywhere this runs: production
// serves the frontend and the API from one process (server.js), the Docker
// stack proxies /api through nginx, and the Vite dev server proxies it to
// localhost:4001 (see vite.config.js).
//
// This used to default to http://localhost:4001/api. VITE_API_URL is a BUILD
// argument, so a production build that did not set it shipped that absolute
// address to every visitor — their browser then tried to reach an API on their
// own machine and the admin login died with ERR_CONNECTION_REFUSED. A default
// that only works on the developer's laptop has no business in a bundle.
const BASE = import.meta.env.VITE_API_URL || '/api'
const TOKEN_KEY = 'rw_admin_token'

export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const setToken = (t) => localStorage.setItem(TOKEN_KEY, t)
export const clearToken = () => localStorage.removeItem(TOKEN_KEY)

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

async function request(method, path, body, { auth = true, isForm = false } = {}) {
  const headers = {}
  const token = getToken()
  if (auth && token) headers.Authorization = `Bearer ${token}`

  let payload
  if (body !== undefined) {
    if (isForm) {
      payload = body // FormData — let the browser set the content-type/boundary
    } else {
      headers['Content-Type'] = 'application/json'
      payload = JSON.stringify(body)
    }
  }

  let res
  try {
    res = await fetch(`${BASE}${path}`, { method, headers, body: payload })
  } catch {
    throw new ApiError('Cannot reach the server. Is the API running?', 0)
  }

  const text = await res.text()
  const data = text ? safeParse(text) : null

  if (!res.ok) {
    const msg = (data && data.error) || res.statusText || 'Request failed'
    throw new ApiError(msg, res.status)
  }
  return data
}

function safeParse(text) {
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

export const api = {
  get: (path, opts) => request('GET', path, undefined, opts),
  post: (path, body, opts) => request('POST', path, body, opts),
  put: (path, body, opts) => request('PUT', path, body, opts),
  patch: (path, body, opts) => request('PATCH', path, body, opts),
  del: (path, opts) => request('DELETE', path, undefined, opts),
  upload: (path, formData) => request('POST', path, formData, { isForm: true }),
}
