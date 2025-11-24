import { PrismaClient } from '@prisma/client';
import { Pool } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

let db: PrismaClient;

// Prisma 7 requires an adapter or accelerateUrl
if (process.env.DATABASE_URL) {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  // @ts-ignore - Type mismatch between Neon Pool and Prisma adapter
  const adapter = new PrismaNeon(pool);

  db = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
} else {
  // Fallback - create a basic client (will error if used without DATABASE_URL)
  throw new Error('DATABASE_URL is required');
}

export { db };

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
