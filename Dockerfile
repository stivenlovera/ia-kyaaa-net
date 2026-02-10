# Stage 1: Build
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

ENV NEXT_PRIVATE_STANDALONE=true
#env
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

# Generate Prisma Client
RUN npx prisma generate

RUN npm run build

# Stage 2: Run
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV production

# Copy everything needed for 'npm start'
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 4000
ENV PORT 4000

# Next.js 16 requires 'npm start' for this configuration
CMD ["npm", "start"]