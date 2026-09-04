# Build from the monorepo root:
#   docker build -f apps/api/Dockerfile -t pulsewatch-api .
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat openssl

FROM base AS pruner
WORKDIR /app
RUN npm install -g turbo@2.10.12
COPY . .
RUN turbo prune @pulsewatch/api --docker

FROM base AS installer
WORKDIR /app
RUN npm install -g pnpm@9.12.0
COPY --from=pruner /app/out/json/ .
RUN pnpm install --frozen-lockfile
COPY --from=pruner /app/out/full/ .
RUN pnpm --filter @pulsewatch/db run generate

FROM base AS runner
WORKDIR /app
RUN npm install -g pnpm@9.12.0 \
  && addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 pulsewatch
COPY --from=installer --chown=pulsewatch:nodejs /app .
USER pulsewatch
WORKDIR /app/apps/api
ENV NODE_ENV=production
EXPOSE 4000
CMD ["pnpm", "start"]
