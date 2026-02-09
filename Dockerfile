# Dependencias
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN npm ci

# Constructor
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Runner (Producción)
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

#env
ENV PORT 3000

ARG DB_HOST=${DB_HOST}
ENV DB_HOST=${DB_HOST}
ARG DB_USER=${DB_USER}
ENV DB_USER=${DB_USER}
ARG DB_PORT=${DB_PORT}
ENV DB_PORT=${DB_PORT}
ARG DB_PASS=${DB_PASS}
ENV DB_PASS=${DB_PASS}
ARG DB_DATABASE=${DB_DATABASE}
ENV DB_DATABASE=${DB_DATABASE}
ARG DB_CONECTION_LIMIT=${DB_CONECTION_LIMIT}
ENV DB_CONECTION_LIMIT=${DB_CONECTION_LIMIT}
ARG DATABASE_URL=${DATABASE_URL}
ENV DATABASE_URL=${DATABASE_URL}
ARG JWT_SECRET=${JWT_SECRET}
ENV JWT_SECRET=${JWT_SECRET}
ARG JWT_EXPIRES_IN=${JWT_EXPIRES_IN}
ENV JWT_EXPIRES_IN=${JWT_EXPIRES_IN}
ARG URL_S3=${URL_S3}
ENV URL_S3=${URL_S3}
ARG PATH_LOGS=${PATH_LOGS}
ENV PATH_LOGS=${PATH_LOGS}

CMD ["node", "server.js"]