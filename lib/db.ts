import { PrismaClient } from '@prisma/client';
import { Pool } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error('[Prisma] DATABASE_URL is not set. Database operations will fail.');
    console.error('[Prisma] Please configure DATABASE_URL in your .env file.');
    // Return a proxy that throws helpful errors on any database operation
    return new Proxy({} as PrismaClient, {
      get(_, prop) {
        if (prop === 'then') return undefined; // Allow Promise checks
        return () => {
          throw new Error(
            'DATABASE_URL is not configured. Please add a valid PostgreSQL connection string to your .env file.'
          );
        };
      },
    });
  }

  const pool = new Pool({ connectionString: databaseUrl });
  // @ts-ignore - Type mismatch between Neon Pool and Prisma adapter
  const adapter = new PrismaNeon(pool);

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
}

const db = globalForPrisma.prisma ?? createPrismaClient();

export { db };

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
