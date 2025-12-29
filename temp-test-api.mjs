import { Pool } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaNeon(pool);
const prisma = new PrismaClient({ adapter });

try {
  const tierlists = await prisma.tierList.findMany({
    where: { isPublic: true },
    include: {
      user: {
        select: { username: true, imageUrl: true },
      },
      votes: {
        select: { value: true },
      },
      _count: {
        select: { votes: true, comments: true },
      },
    },
  });
  console.log('Found tierlists:', tierlists.length);
  console.log('First tierlist:', JSON.stringify(tierlists[0], null, 2));
} catch (error) {
  console.error('Error:', error);
}

await prisma.$disconnect();
