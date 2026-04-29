// lib/prisma.ts
import { PrismaClient } from '../../../generated/prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import logger, { jsonLog } from './logger';

const databaseUrl = process.env.DATABASE_URL!;
const adapter = new PrismaMariaDb(databaseUrl);

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  })


if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}