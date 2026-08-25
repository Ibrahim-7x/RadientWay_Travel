import db from '../db.js'
import { deserialize, serialize } from './json.js'
import { notFound, badRequest } from './httpError.js'
import { asyncHandler } from '../middleware/error.js'

// Builds a set of Express handlers for one model.
//
// config = {
//   model:      'package',                 // delegate key (see db.js)
//   jsonFields: ['gallery', 'tags', ...],  // TEXT columns holding JSON
//   orderBy:    [{ order: 'asc' }],         // default ordering
//   required:   ['name', 'slug'],          // required on create
//   allowed:    ['name', 'slug', ...],      // whitelist of writable fields
//   defaults:   {},                        // applied on create if absent
// }
export function crud(config) {
  const {
    model,
    jsonFields = [],
    orderBy = [{ createdAt: 'desc' }],
    required = [],
    allowed = null,
    defaults = {},
  } = config

  const delegate = () => db[model]

  // Keep only whitelisted, writable fields off the request body.
  //
  // Strings are trimmed on the way in. A stray space typed into the admin form
  // is invisible there and survives every equality check MySQL makes — its
  // collation is PAD SPACE, so `slug = 'x'` still finds a row holding `'x '` —
  // but JavaScript compares the two as different strings. A slug saved as
  // "tour-France-couple " therefore fetched fine and then made TourDetail
  // redirect to its own canonical path forever, rendering a blank page.
  const clean = (v) => (typeof v === 'string' ? v.trim() : v)

  const pick = (body) => {
    if (!body || typeof body !== 'object') return {}
    const src = allowed ? allowed.filter((k) => k in body) : Object.keys(body)
    const out = {}
    for (const k of src) out[k] = clean(body[k])
    return out
  }

  const list = asyncHandler(async (req, res) => {
    // Optional admin filters: ?published=true, ?q=search (name/title/country)
    const where = {}
    if (req.query.published === 'true') where.published = true
    if (req.query.published === 'false') where.published = false

    const rows = await delegate().findMany({ where, orderBy })
    res.json(deserialize(rows, jsonFields))
  })

  // Public list — only published rows.
  const listPublished = asyncHandler(async (_req, res) => {
    const rows = await delegate().findMany({ where: { published: true }, orderBy })
    res.json(deserialize(rows, jsonFields))
  })

  const getById = asyncHandler(async (req, res) => {
    const id = Number(req.params.id)
    if (Number.isNaN(id)) throw badRequest('Invalid id')
    const row = await delegate().findUnique({ where: { id } })
    if (!row) throw notFound()
    res.json(deserialize(row, jsonFields))
  })

  // Public getter by unique `slug` (used by packages).
  const getBySlug = asyncHandler(async (req, res) => {
    const row = await delegate().findFirst({
      where: { slug: req.params.slug, published: true },
    })
    if (!row) throw notFound()
    res.json(deserialize(row, jsonFields))
  })

  const create = asyncHandler(async (req, res) => {
    const data = { ...defaults, ...pick(req.body) }
    for (const f of required) {
      if (data[f] === undefined || data[f] === null || data[f] === '') {
        throw badRequest(`Missing required field: ${f}`)
      }
    }
    const row = await delegate().create({ data: serialize(data, jsonFields) })
    res.status(201).json(deserialize(row, jsonFields))
  })

  const update = asyncHandler(async (req, res) => {
    const id = Number(req.params.id)
    if (Number.isNaN(id)) throw badRequest('Invalid id')
    const data = serialize(pick(req.body), jsonFields)
    const row = await delegate().update({ where: { id }, data })
    res.json(deserialize(row, jsonFields))
  })

  const remove = asyncHandler(async (req, res) => {
    const id = Number(req.params.id)
    if (Number.isNaN(id)) throw badRequest('Invalid id')
    await delegate().delete({ where: { id } })
    res.json({ ok: true, id })
  })

  return { list, listPublished, getById, getBySlug, create, update, remove }
}
