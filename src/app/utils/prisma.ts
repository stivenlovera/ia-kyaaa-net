// lib/prisma.ts
import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
const adapter = new PrismaMariaDb({
  host: "127.0.0.1",
  port: 3306,
  connectionLimit: 20,
  user: 'root',
  password: '',
  database: 'ia_kyaaa'
});

const primaClientSingleton = () => {
  return new PrismaClient({ adapter })
}

declare const globalThis: {
  primaGlobal: ReturnType<typeof primaClientSingleton>;
} & typeof global;

const prisma = globalThis.primaGlobal ?? primaClientSingleton();

export default prisma;

if (process.env.NODE_ENV === 'production') globalThis.primaGlobal = prisma;
