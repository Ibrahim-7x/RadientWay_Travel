// Boot-time secret validation.
//
// Every secret in this project has a development fallback so `npm run dev`
// works with no setup. Those fallbacks are committed to a git repo, which makes
// them public knowledge — a JWT_SECRET anyone can read lets them forge an admin
// token, and a known ADMIN_PASSWORD is simply a published login. The fallbacks
// are silent, so nothing would tell you they had reached production.
//
// This module makes that failure loud instead: in production the process
// refuses to start unless the secrets are set to something of our own.

export const isProduction = process.env.NODE_ENV === 'production'

// The placeholder values that ship in this repo — .env.example, the seed
// script's default, and the old fallback in lib/auth.js. Any of these in
// production means the secret is not a secret.
const PUBLISHED_DEFAULTS = new Set([
  'change-me-to-a-long-random-secret-string',
  'dev-secret-change-me',
  'ChangeMe123!',
  // Placeholders from .env.example. Listed so importing that file wholesale
  // into a hosting panel fails loudly on the first boot instead of quietly
  // running production on a value published in this repo.
  'REPLACE_WITH_A_GENERATED_SECRET',
  'REPLACE_WITH_A_REAL_PASSWORD',
])

const MIN_JWT_SECRET_LENGTH = 32

// Every placeholder in .env.example contains this. Panels import that file
// wholesale, and the ones that are not secrets used to sail straight through:
// an unedited UPLOAD_DIR produced `EACCES: mkdir /home/REPLACE_WITH_YOUR_PATH/…`
// from deep inside multer, which reads as a permissions bug rather than an
// unedited config. Catch the marker in any variable instead.
const PLACEHOLDER_MARKER = 'REPLACE_WITH_'

function unedited() {
  return Object.entries(process.env)
    .filter(([, v]) => typeof v === 'string' && v.includes(PLACEHOLDER_MARKER))
    .map(([k]) => `${k} is still a placeholder from .env.example`)
}

function inspect(name) {
  const value = process.env[name]
  if (!value) return `${name} is not set`
  if (PUBLISHED_DEFAULTS.has(value)) {
    return `${name} is still the example value committed to this repo`
  }
  if (name === 'JWT_SECRET' && value.length < MIN_JWT_SECRET_LENGTH) {
    return `JWT_SECRET is ${value.length} characters; use at least ${MIN_JWT_SECRET_LENGTH}`
  }
  return null
}

/**
 * Exits the process if any named secret is missing, still set to a published
 * default, or too weak — or if any environment variable at all still holds a
 * REPLACE_WITH_ placeholder. Outside production this only warns, so local work
 * and CI keep running with the dev fallbacks.
 */
export function requireSecrets(names) {
  const problems = [...new Set([...names.map(inspect).filter(Boolean), ...unedited()])]
  if (!problems.length) return

  const detail = problems.map((p) => `    - ${p}`).join('\n')

  if (!isProduction) {
    console.warn(`\n  [env] Using development fallbacks:\n${detail}\n`)
    return
  }

  console.error(
    `\n  Refusing to start: insecure configuration in production.\n\n${detail}\n\n` +
      `  Generate a secret with:\n` +
      `    node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"\n`,
  )
  process.exit(1)
}
