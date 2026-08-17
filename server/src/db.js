// Database access — a small MySQL client shaped like the Prisma Client calls
// this app makes.
//
// Prisma's Rust query engine cannot run on this site's shared host. It starts a
// Tokio thread pool sized to the machine's core count; the host's process cap
// refuses the threads, the runtime dies mid-request, and every query fails with
// `PANIC: timer has gone away`. That is prisma/prisma#26073 and a run of
// duplicates, all open, none with a fix. The engine is the only broken part —
// the schema, the tables and the query shapes are all fine — so this replaces
// the engine and nothing else.
//
// Which is affordable because the app asks very little of an ORM: no relations,
// no transactions, no operators. Every query is one table with equality filters.
// Keeping Prisma's call shapes means the controllers, the CRUD factory and the
// seed script did not have to change.
//
// schema.prisma stays the single source of truth. Models, columns, types and
// defaults are read from it at boot, so a new field in the schema needs no edit
// here — and a typo'd field name fails loudly instead of reaching SQL.

import path from 'node:path'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import mysql from 'mysql2/promise'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// ── schema.prisma → { [delegate]: { table, fields, idField } } ───────────────

// `@default(now())` nests parentheses, so the capture runs to the first `)`
// that ends the attribute rather than the first `)` at all.
const DEFAULT_RE = /@default\((.*?)\)(?=\s|$)/

function parseDefault(raw) {
  if (raw === 'now()') return { now: true }
  if (raw.endsWith('()')) return null // autoincrement(), uuid(), … — the DB's job
  if (raw === 'true' || raw === 'false') return { value: raw === 'true' }
  if (/^-?\d+(\.\d+)?$/.test(raw)) return { value: Number(raw) }
  const quoted = raw.match(/^"([\s\S]*)"$/)
  return quoted ? { value: quoted[1] } : null
}

export function parseSchema(text) {
  const models = {}
  // The body runs to a `}` in the first column, not to the first `}` anywhere:
  // a field comment can contain one (`// JSON {day,title,detail}[]`), and
  // stopping there silently drops every field below it.
  for (const [, model, body] of text.matchAll(/^model\s+(\w+)\s*\{([\s\S]*?)^\}/gm)) {
    const fields = {}
    let idField = null
    for (const line of body.split('\n')) {
      // Trailing `// admin | editor` comments would otherwise land in the attrs.
      const clean = line.replace(/\/\/.*$/, '').trim()
      const match = clean.match(/^(\w+)\s+(\w+)(\?)?\s*(.*)$/)
      if (!match) continue
      const [, name, type, optional, attrs] = match
      const def = attrs.match(DEFAULT_RE)
      fields[name] = {
        type,
        optional: Boolean(optional),
        isUpdatedAt: attrs.includes('@updatedAt'),
        default: def ? parseDefault(def[1]) : null,
      }
      if (/@id\b/.test(attrs)) idField = name
    }
    // Prisma's delegate key is the model name with a lowercase first letter.
    models[model[0].toLowerCase() + model.slice(1)] = { table: model, fields, idField }
  }
  return models
}

const MODELS = parseSchema(
  readFileSync(path.join(__dirname, '..', 'prisma', 'schema.prisma'), 'utf8'),
)

// ── Connection ──────────────────────────────────────────────────────────────

// Parsed by hand rather than handed to mysql2 as a URI so an unescaped `@` in
// the password — which is what a generated hosting password usually contains —
// resolves the same way a browser would resolve it, and percent-encoded
// passwords still decode correctly.
export function connectionOptions(url) {
  const u = new URL(url)
  return {
    // "localhost" is not handed to the resolver: Node has preferred the IPv6
    // answer since v17, and a MySQL account granted to 'user'@'localhost' is an
    // IPv4/socket grant — the connection arrives from ::1 and is refused with
    // `Access denied for user '…'@'::1' (using password: YES)`, which reads as
    // a wrong password rather than a wrong address family.
    host: u.hostname === 'localhost' ? '127.0.0.1' : u.hostname,
    port: Number(u.port) || 3306,
    user: decodeURIComponent(u.username),
    password: decodeURIComponent(u.password),
    database: decodeURIComponent(u.pathname.replace(/^\//, '')),
  }
}

const DATABASE_URL = process.env.DATABASE_URL
if (!DATABASE_URL) {
  console.error('\n  DATABASE_URL is not set.\n')
  process.exit(1)
}

const pool = mysql.createPool({
  ...connectionOptions(DATABASE_URL),
  // Shared hosting caps concurrent MySQL connections far below what a
  // core-count-derived default would open. Five is plenty for this traffic.
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT) || 5,
  waitForConnections: true,
  charset: 'utf8mb4',
  // Prisma writes UTC into DATETIME(3). Without this, mysql2 would read those
  // values back as if they were in the server's local zone.
  timezone: 'Z',
  supportBigNumbers: true,
})

// Prisma's error codes, because middleware/error.js maps them to 409 and 404.
export function translate(err) {
  if (err?.code === 'ER_DUP_ENTRY') {
    // "Duplicate entry 'x' for key 'Subscriber_email_key'" → email
    const field = err.message.match(/for key '(?:\w+?_)?(\w+?)_key'/)?.[1]
    const e = new Error(err.message)
    e.code = 'P2002'
    e.meta = { target: [field || 'field'] }
    return e
  }
  return err
}

// Held in an object so db.test.js can swap it out and read the generated SQL
// without a database to run it against.
export const driver = {
  async run(sql, params = []) {
    try {
      const [result] = await pool.query(sql, params)
      return result
    } catch (err) {
      throw translate(err)
    }
  },
}

const run = (sql, params) => driver.run(sql, params)

function recordNotFound() {
  const err = new Error('Record not found.')
  err.code = 'P2025'
  return err
}

// ── Query building ──────────────────────────────────────────────────────────

const delegateFor = (model) => {
  const { table, fields, idField } = model

  // Every identifier that reaches SQL is checked against the schema first. The
  // call sites all pass literal field names today, but this is the boundary
  // where a request-derived key would become SQL, so it is guarded here.
  const col = (name) => {
    if (!Object.hasOwn(fields, name)) {
      throw new Error(`Unknown field ${table}.${name}`)
    }
    return `\`${name}\``
  }

  // MySQL returns BOOLEAN as TINYINT 1/0; the API contract is true/false.
  const cast = (row) => {
    if (!row) return null
    const out = {}
    for (const [k, v] of Object.entries(row)) {
      out[k] = fields[k]?.type === 'Boolean' && v !== null ? Boolean(v) : v
    }
    return out
  }

  const buildWhere = (where) => {
    const keys = Object.keys(where || {})
    return {
      sql: keys.length ? ` WHERE ${keys.map((k) => `${col(k)} = ?`).join(' AND ')}` : '',
      params: keys.map((k) => where[k]),
    }
  }

  // orderBy is either { createdAt: 'desc' } or [{ order: 'asc' }, …].
  const buildOrder = (orderBy) => {
    const clauses = [orderBy].flat().filter(Boolean).flatMap((entry) =>
      Object.entries(entry).map(
        ([k, dir]) => `${col(k)} ${String(dir).toLowerCase() === 'desc' ? 'DESC' : 'ASC'}`,
      ),
    )
    return clauses.length ? ` ORDER BY ${clauses.join(', ')}` : ''
  }

  const buildLimit = (take) => {
    if (take == null) return ''
    const n = Number(take)
    if (!Number.isInteger(n) || n < 0) throw new Error(`Invalid take: ${take}`)
    return ` LIMIT ${n}`
  }

  // Prisma applies @default and @updatedAt client-side — the columns carry no
  // DEFAULT in MySQL (TEXT columns cannot have one), so this has to too.
  const withDefaults = (data) => {
    const row = {}
    for (const key of Object.keys(data)) col(key)
    for (const [name, field] of Object.entries(fields)) {
      if (data[name] !== undefined) row[name] = data[name]
      else if (field.isUpdatedAt || field.default?.now) row[name] = new Date()
      else if (field.default) row[name] = field.default.value
      // Anything else is left out: the DB supplies it (autoincrement id,
      // CURRENT_TIMESTAMP) or rejects the write, exactly as Prisma would.
    }
    return row
  }

  const touch = (data) => {
    const row = { ...data }
    for (const key of Object.keys(row)) col(key)
    for (const [name, field] of Object.entries(fields)) {
      if (field.isUpdatedAt) row[name] = new Date()
    }
    return row
  }

  const insert = async (data) => {
    const row = withDefaults(data)
    const cols = Object.keys(row)
    const result = await run(
      `INSERT INTO \`${table}\` (${cols.map(col).join(', ')})` +
        ` VALUES (${cols.map(() => '?').join(', ')})`,
      cols.map((c) => row[c]),
    )
    // A String @id (Setting.key) is supplied by the caller; an Int one comes back.
    return fields[idField].type === 'Int' ? result.insertId : row[idField]
  }

  const self = {
    async findMany({ where, orderBy, take } = {}) {
      const w = buildWhere(where)
      const rows = await run(
        `SELECT * FROM \`${table}\`${w.sql}${buildOrder(orderBy)}${buildLimit(take)}`,
        w.params,
      )
      return rows.map(cast)
    },

    async findFirst({ where, orderBy } = {}) {
      const [row] = await self.findMany({ where, orderBy, take: 1 })
      return row ?? null
    },

    // Prisma restricts this to unique fields; every call site already does.
    findUnique({ where }) {
      return self.findFirst({ where })
    },

    async count({ where } = {}) {
      const w = buildWhere(where)
      const rows = await run(`SELECT COUNT(*) AS n FROM \`${table}\`${w.sql}`, w.params)
      return Number(rows[0].n)
    },

    async create({ data }) {
      const id = await insert(data)
      return self.findUnique({ where: { [idField]: id } })
    },

    async update({ where, data }) {
      const row = touch(data)
      const cols = Object.keys(row)
      if (!cols.length) throw new Error('update called with no fields')
      const w = buildWhere(where)
      await run(
        `UPDATE \`${table}\` SET ${cols.map((c) => `${col(c)} = ?`).join(', ')}${w.sql}`,
        [...cols.map((c) => row[c]), ...w.params],
      )
      // Read back rather than trust affectedRows, which counts changed rows and
      // so reports 0 for a write that set every column to what it already held.
      const updated = await self.findFirst({ where })
      if (!updated) throw recordNotFound()
      return updated
    },

    async delete({ where }) {
      const w = buildWhere(where)
      const result = await run(`DELETE FROM \`${table}\`${w.sql}`, w.params)
      if (!result.affectedRows) throw recordNotFound()
      return { ...where }
    },

    // One statement, so two callers racing the same new email cannot both
    // insert — the loser updates instead of erroring on the unique index.
    async upsert({ where, update, create }) {
      const row = withDefaults(create)
      const cols = Object.keys(row)
      const patch = touch(update)
      const patchCols = Object.keys(patch)
      await run(
        `INSERT INTO \`${table}\` (${cols.map(col).join(', ')})` +
          ` VALUES (${cols.map(() => '?').join(', ')})` +
          ` ON DUPLICATE KEY UPDATE ${patchCols.map((c) => `${col(c)} = ?`).join(', ')}`,
        [...cols.map((c) => row[c]), ...patchCols.map((c) => patch[c])],
      )
      return self.findFirst({ where })
    },
  }

  return self
}

const db = { $disconnect: () => pool.end() }
for (const [key, model] of Object.entries(MODELS)) db[key] = delegateFor(model)

export default db
