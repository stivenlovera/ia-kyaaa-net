// lib/prisma.ts
import { PrismaClient } from '../../../generated/prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import logger, { jsonLog } from './logger';

logger.info(`env ${jsonLog({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT!),
  connectionLimit: parseInt(process.env.DB_CONECTION_LIMIT!),
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
})}`)
const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST,
  //port: parseInt(process.env.DB_PORT!),
  connectionLimit: parseInt(process.env.DB_CONECTION_LIMIT!),
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
});

/* const primaClientSingleton = () => {
  return new PrismaClient({ adapter })
}

declare const globalThis: {
  primaGlobal: ReturnType<typeof primaClientSingleton>;
} & typeof global;

const prisma = globalThis.primaGlobal ?? primaClientSingleton();

export default prisma;
 */
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