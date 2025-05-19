
FROM node:22-alpine

RUN corepack enable && \
  corepack use pnpm@latest-10

WORKDIR /app

COPY pnpm-lock.yaml ./
COPY package.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY apps ./apps
COPY libs ./libs

RUN pnpm install --frozen-lockfile \
  && pnpm prisma generate --schema ./apps/transaction-service/prisma/schema.prisma \
  && pnpm build --all