# RadiantWay Travel API — local development image.
# Runs the Express server with hot reload via `node --watch`. Prisma targets
# MySQL, served by the `db` container in docker-compose.yml.
#
# The build context is ./server. It used to be the repository root, because the
# seed imported the frontend's data modules from ../../src/data — the seed now
# only creates the admin account, so that is gone.
FROM node:20-alpine AS development
WORKDIR /app

# Prisma's query engine needs OpenSSL on Alpine/musl.
RUN apk add --no-cache openssl

COPY package*.json ./
RUN npm ci

# Generate the client before the rest of the source so the musl engine lands in
# the image's node_modules. compose shadows the host's node_modules with an
# anonymous volume seeded from here, keeping Windows engines out of the container.
COPY prisma ./prisma
RUN npx prisma generate

COPY . .

EXPOSE 4001
CMD ["npm", "run", "dev"]
