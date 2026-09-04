// Side-effect import: loads server/.env by its own path rather than the
// process's cwd. `node server/src/index.js` from the repo root otherwise picks
// up the frontend's .env and dies on a missing DATABASE_URL.
//
// It has to be a module, not a call: ESM hoists every `import` above statement
// bodies, so a loadEnv() call in index.js would run after ./app.js — and
// ./db.js — had already read process.env. Import this first.
import { config } from 'dotenv'

config({ path: new URL('../../.env', import.meta.url) })
