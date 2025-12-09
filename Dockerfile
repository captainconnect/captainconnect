FROM node:24.11.0-alpine3.22 AS base

# Build dependencies installation stage
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Build stage
FROM base AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm install -g pnpm && pnpm exec node ace build

# Production dependencies installation stage
FROM base AS production-deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile --prod

# Finale image stage
FROM base AS production
ENV NODE_ENV=production
WORKDIR /app
COPY --from=production-deps /app/node_modules ./node_modules
COPY --from=build /app/build ./build
COPY package.json ./
COPY ./CHANGELOG.md ./build/public

EXPOSE 3333

CMD ["node", "build/bin/server.js"]