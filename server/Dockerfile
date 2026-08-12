# RadiantWay Travel API — local development image.
# Runs the Express server with hot reload via `node --watch`. Prisma targets
# SQLite, so there is no database container: the .db file lives on the mounted
# volume alongside the source (see docker-compose.yml).
#
# NOTE: the build context is the REPOSITORY ROOT, not ./server. prisma/seed.js
# imports the frontend's data modules as ../../src/data/*.js, which resolves to
# /src/data — outside WORKDIR — so those files have to come along.
FROM node:20-alpine AS development
WORKDIR /app

# Prisma's query engine needs OpenSSL on Alpine/musl.
RUN apk add --no-cache openssl

COPY server/package*.json ./
RUN npm ci

# Generate the client before the rest of the source so the musl engine lands in
# the image's node_modules. compose shadows the host's node_modules with an
# anonymous volume seeded from here, keeping Windows engines out of the container.
COPY server/prisma ./prisma
RUN npx prisma generate

COPY server/ .

# Seed data shared with the frontend — resolves to the /src/data that
# prisma/seed.js reaches for.
COPY src/data /src/data

EXPOSE 4001
CMD ["npm", "run", "dev"]
