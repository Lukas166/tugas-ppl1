FROM node:24-alpine AS deps

WORKDIR /app

ENV CI=true

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

FROM node:24-alpine AS builder

WORKDIR /app

ENV CI=true
ARG DATABASE_URL=postgresql://postgres:postgres@db:5432/pokemon_db?schema=public
ENV DATABASE_URL=${DATABASE_URL}

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm prisma generate
RUN pnpm build

FROM node:24-alpine AS runner

WORKDIR /app

ENV CI=true
ARG DATABASE_URL=postgresql://postgres:postgres@db:5432/pokemon_db?schema=public
ENV DATABASE_URL=${DATABASE_URL}

RUN corepack enable && corepack prepare pnpm@latest --activate

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/generated ./generated
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder /app/src/app/api ./src/app/api

EXPOSE 3000

CMD ["pnpm", "start"]
