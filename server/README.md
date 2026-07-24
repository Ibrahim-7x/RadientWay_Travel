# RadiantWay Travel — Backend & Admin API

Express + Prisma (SQLite) backend powering the public site and the `/admin` panel.

## Quick start

```bash
cd server
npm install
cp .env.example .env          # adjust secrets/ports if needed
npx prisma migrate dev        # creates the SQLite DB + tables
npm run seed                  # imports the existing site content + admin user
npm start                     # http://localhost:4001
```

Then, from the project root, run the frontend:

```bash
npm install
npm run dev                   # http://localhost:5173  (admin at /admin)
```

> **Port note:** the API runs on **4001** (port 4000 was occupied by an unrelated
> process on this machine). The frontend reads the API URL from the root `.env`
> (`VITE_API_URL`). Change both `server/.env` (`PORT`, `PUBLIC_URL`) and the root
> `.env` together if you move it.

## Default admin login

Created by the seed script from `server/.env`:

- **Email:** `admin@radiantwaytravel.com`
- **Password:** `ChangeMe123!`

Change these in `.env` before seeding (or update the `AdminUser` row later).
**Change `JWT_SECRET` before deploying.**

## Scripts

| Command | What it does |
| --- | --- |
| `npm start` | Run the API |
| `npm run dev` | Run with `node --watch` (auto-restart) |
| `npm run seed` | Seed content + admin user (idempotent — skips populated tables) |
| `npm run prisma:studio` | Open Prisma Studio (visual DB browser) |
| `npm run db:reset` | Drop, re-migrate and re-seed the DB |

## API overview

Base URL: `/api`

### Public (no auth)
- `GET /packages`, `GET /packages/:slug`
- `GET /destinations`, `GET /visas`, `GET /testimonials`, `GET /faqs`, `GET /services`, `GET /settings`
- `POST /bookings` — booking request (Book Now wizard)
- `POST /contact` — contact message
- `POST /subscribe` — newsletter sign-up

### Auth
- `POST /auth/login` → `{ token, user }`
- `GET /auth/me` (Bearer token)

### Admin (Bearer token required, prefix `/admin`)
- `GET /admin/dashboard` — counts + recent activity
- CRUD `GET/POST/PUT/DELETE /admin/{packages|destinations|visas|testimonials|faqs|services}`
- `GET/PATCH/DELETE /admin/bookings`, `/admin/leads` (status management)
- `GET/DELETE /admin/subscribers`
- `GET/PUT /admin/settings` — company info
- `POST /admin/upload` — image upload (multipart field `image`) → `{ url }`

## Data model

SQLite via Prisma (`prisma/schema.prisma`). Array/object fields (galleries, tags,
itineraries, document lists) are stored as JSON strings in TEXT columns and
(de)serialised in the app layer (`src/lib/json.js`), keeping the schema portable.

To move to PostgreSQL later: change the `datasource` provider + `DATABASE_URL`,
then re-run `prisma migrate dev`.
