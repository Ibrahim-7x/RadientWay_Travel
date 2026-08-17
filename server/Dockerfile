# RadiantWay Travel API — local development image.
# Runs the Express server with hot reload via `node --watch`, against the MySQL
# served by the `db` container in docker-compose.yml.
#
# The build context is ./server. It used to be the repository root, because the
# seed imported the frontend's data modules from ../../src/data — the seed now
# only creates the admin account, so that is gone.
#
# No native engine to install or generate: src/db.js talks to MySQL through
# mysql2 and reads prisma/schema.prisma as plain text (see the note at its top).
FROM node:20-alpine AS development
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 4001
CMD ["npm", "run", "dev"]
