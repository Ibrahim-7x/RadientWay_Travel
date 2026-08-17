// Self-check for db.js — run with: node server/src/db.test.js
//
// No database: `driver` is swapped for a recorder, so what these assert is the
// SQL and the parameters the delegates build, plus the schema parsing they are
// built from. Those are the parts that are hand-rolled and can be silently
// wrong; MySQL executing valid SQL is not this file's problem.

import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

process.env.DATABASE_URL ??= 'mysql://u:p@localhost:3306/test'

const { default: db, driver, parseSchema, translate, connectionOptions } =
  await import('./db.js')

// ── connection string ───────────────────────────────────────────────────────

// A local database is reached through the socket, because that is what a
// 'user'@'localhost' grant means once skip-name-resolve is on.
const SOCK = '/var/lib/mysql/mysql.sock'
assert.equal(connectionOptions('mysql://u:p@localhost:3306/d', SOCK).socketPath, SOCK)
assert.equal(connectionOptions('mysql://u:p@127.0.0.1:3306/d', SOCK).socketPath, SOCK)
assert.equal(connectionOptions('mysql://u:p@[::1]:3306/d', SOCK).socketPath, SOCK)

// A remote database is never socket-connected, however many sockets are around.
const remote = connectionOptions('mysql://u:p@db.example.com:3307/d', SOCK)
assert.equal(remote.host, 'db.example.com')
assert.equal(remote.port, 3307)
assert.ok(!remote.socketPath)

// With no socket on the box it falls back to TCP — but never to the literal
// "localhost", or Node resolves it to ::1 and the grant misses again.
assert.equal(connectionOptions('mysql://u:p@localhost:3306/d', null).host, '127.0.0.1')
assert.equal(connectionOptions('mysql://u:p@localhost/d', null).port, 3306, 'port defaults')

// A hosting panel's generated password contains characters that are legal in a
// URL and characters that are not; both have to arrive at MySQL intact.
assert.equal(connectionOptions('mysql://u:Pass%40Word2026@localhost/d', null).password, 'Pass@Word2026')
assert.equal(connectionOptions('mysql://u:Pass@Word2026@localhost/d', null).password, 'Pass@Word2026')
assert.equal(connectionOptions('mysql://u:p@localhost/u382_radiantway', null).database, 'u382_radiantway')

// ── schema parsing ──────────────────────────────────────────────────────────

const models = parseSchema(`
model AdminUser {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  role      String   @default("admin") // admin | editor
  active    Boolean  @default(true)
  rating    Float    @default(4.5)
  gallery   String   @default("[]") @db.Text
  itinerary String   @default("[]") @db.LongText // JSON {day,title,detail}[]
  optional  String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
`)

const admin = models.adminUser
assert.ok(admin, 'model key is the model name with a lowercase first letter')
assert.equal(admin.table, 'AdminUser')
assert.equal(admin.idField, 'id')
assert.equal(admin.fields.id.default, null, 'autoincrement() is left to the DB')
assert.equal(admin.fields.role.default.value, 'admin', 'trailing // comment is not part of the default')
assert.equal(admin.fields.active.default.value, true)
assert.equal(admin.fields.rating.default.value, 4.5)
assert.equal(admin.fields.gallery.default.value, '[]', '@db.Text after the default does not confuse it')
assert.equal(admin.fields.optional.optional, true)
assert.equal(admin.fields.createdAt.default.now, true, 'now() survives its nested parens')
assert.equal(admin.fields.updatedAt.isUpdatedAt, true)
// The `}` in itinerary's comment must not end the model body early.
assert.ok(admin.fields.createdAt, 'fields below a comment containing } are still parsed')

// Every field the app orders, filters or writes by has to exist in the real
// schema, or it only fails once a request reaches it.
const realModels = parseSchema(
  readFileSync(new URL('../prisma/schema.prisma', import.meta.url), 'utf8'),
)
for (const [key, m] of Object.entries(realModels)) {
  assert.ok(m.idField, `${key} has an @id`)
  assert.ok(Object.keys(m.fields).length > 1, `${key} parsed more than one field`)
}
assert.ok(realModels.package.fields.createdAt, 'Package.createdAt is the default orderBy')

// ── query building ──────────────────────────────────────────────────────────

const calls = []
const real = driver.run
driver.run = async (sql, params) => {
  calls.push({ sql, params })
  if (sql.startsWith('SELECT COUNT')) return [{ n: 3 }]
  if (sql.startsWith('SELECT')) return [{ id: 7 }]
  return { insertId: 7, affectedRows: 1 }
}
const last = () => calls[calls.length - 1]
const reset = () => (calls.length = 0)

await db.package.findMany({ where: { published: true }, orderBy: [{ order: 'asc' }], take: 5 })
assert.equal(
  last().sql,
  'SELECT * FROM `Package` WHERE `published` = ? ORDER BY `order` ASC LIMIT 5',
)
assert.deepEqual(last().params, [true])

await db.booking.findMany({ orderBy: { createdAt: 'desc' } })
assert.equal(last().sql, 'SELECT * FROM `Booking` ORDER BY `createdAt` DESC')

assert.equal(await db.lead.count({ where: { status: 'new' } }), 3)
assert.equal(last().sql, 'SELECT COUNT(*) AS n FROM `Lead` WHERE `status` = ?')

// take is interpolated, not bound, so it must never accept anything but an int.
await assert.rejects(() => db.package.findMany({ take: '5; DROP TABLE Package' }))

// Field names reach SQL as identifiers and cannot be parameterised, so an
// unknown one has to be refused rather than escaped.
await assert.rejects(() => db.package.findMany({ where: { nope: 1 } }), /Unknown field/)
await assert.rejects(() => db.package.findMany({ orderBy: { nope: 'asc' } }), /Unknown field/)

// create fills in the schema's defaults, which MySQL does not hold for TEXT
// columns, and stamps @updatedAt.
reset()
await db.testimonial.create({ data: { name: 'A', trip: 'B', quote: 'C' } })
const insert = calls[0]
const cols = insert.sql.match(/\((.*?)\)/)[1].split(', ')
const row = Object.fromEntries(cols.map((c, i) => [c.replaceAll('`', ''), insert.params[i]]))
assert.equal(row.rating, 5, '@default(5) applied client-side')
assert.equal(row.published, true)
assert.equal(row.order, 0)
assert.ok(row.createdAt instanceof Date && row.updatedAt instanceof Date)
assert.ok(!('id' in row), 'autoincrement id is left to MySQL')
assert.equal(calls[1].sql, 'SELECT * FROM `Testimonial` WHERE `id` = ? LIMIT 1')
assert.deepEqual(calls[1].params, [7], 'created row is read back by insertId')

// A String @id is supplied by the caller, so there is no insertId to read back.
reset()
await db.setting.create({ data: { key: 'company', value: '{}' } })
assert.deepEqual(calls[1].params, ['company'])

// update refreshes @updatedAt and reads the row back rather than trusting
// affectedRows, which is 0 for a write that changed nothing.
reset()
driver.run = async (sql, params) => {
  calls.push({ sql, params })
  return sql.startsWith('SELECT') ? [{ id: 1, status: 'read' }] : { affectedRows: 0 }
}
const updated = await db.lead.update({ where: { id: 1 }, data: { status: 'read' } })
assert.equal(calls[0].sql, 'UPDATE `Lead` SET `status` = ?, `updatedAt` = ? WHERE `id` = ?')
assert.ok(calls[0].params[1] instanceof Date)
assert.deepEqual(calls[0].params[2], 1)
assert.equal(updated.status, 'read')

// …but a row that is genuinely absent still has to raise Prisma's P2025, which
// middleware/error.js turns into a 404.
driver.run = async (sql) => (sql.startsWith('SELECT') ? [] : { affectedRows: 0 })
await assert.rejects(() => db.lead.update({ where: { id: 99 }, data: { status: 'read' } }), {
  code: 'P2025',
})
await assert.rejects(() => db.lead.delete({ where: { id: 99 } }), { code: 'P2025' })

// upsert is one statement, so two callers racing the same email cannot both
// insert and one of them 500 on the unique index.
reset()
driver.run = async (sql, params) => {
  calls.push({ sql, params })
  return sql.startsWith('SELECT') ? [{ id: 1, email: 'a@b.c' }] : { affectedRows: 1 }
}
await db.subscriber.upsert({
  where: { email: 'a@b.c' },
  update: { active: true },
  create: { email: 'a@b.c' },
})
assert.match(calls[0].sql, /^INSERT INTO `Subscriber` .* ON DUPLICATE KEY UPDATE `active` = \?$/)

// TINYINT(1) has to come back as a boolean; the admin UI checks these by value.
driver.run = async () => [{ id: 1, published: 1, featured: 0, name: 'x' }]
const pkg = await db.package.findUnique({ where: { id: 1 } })
assert.equal(pkg.published, true)
assert.equal(pkg.featured, false)

// A duplicate key has to reach the error middleware as Prisma's P2002 (409),
// naming the field, or the newsletter form reports a 500 instead.
driver.run = real
const dup = translate(
  Object.assign(new Error("Duplicate entry 'a@b.c' for key 'Subscriber_email_key'"), {
    code: 'ER_DUP_ENTRY',
  }),
)
assert.equal(dup.code, 'P2002')
assert.deepEqual(dup.meta.target, ['email'])

const other = new Error('connection lost')
assert.equal(translate(other), other, 'anything else passes through untouched')

console.log('db.js: all checks passed')
process.exit(0)
