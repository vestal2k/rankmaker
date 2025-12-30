/* eslint-disable @typescript-eslint/no-require-imports */
const dotenv = require("dotenv");
dotenv.config({ override: true });

const { PrismaClient } = require("@prisma/client");
const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("DATABASE_URL is not set.");
  process.exit(1);
}

const pool = new Pool({ connectionString: databaseUrl });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const DEMO_TITLES = [
  "Best Video Games Ever",
  "Top Marvel Movies Ranked",
  "Pizza Toppings Tier List",
  "Greatest Anime of All Time",
  "Best Music Artists 2020s",
  "Football Legends Ranked",
];

async function main() {
  console.log("Resetting demo tierlists to blank templates...");

  for (const title of DEMO_TITLES) {
    const tierlist = await prisma.tierList.findFirst({
      where: { title },
      include: { tiers: { include: { items: true } } },
    });

    if (!tierlist) {
      console.log(`Not found: ${title}`);
      continue;
    }

    let poolTier = tierlist.tiers.find((t: { name: string }) => t.name === "__POOL__");

    if (!poolTier) {
      poolTier = await prisma.tier.create({
        data: {
          name: "__POOL__",
          color: "#e5e5e5",
          order: 999,
          tierListId: tierlist.id,
        },
      });
      console.log(`Created __POOL__ tier for: ${title}`);
    }

    const allItems = tierlist.tiers
      .filter((t: { name: string }) => t.name !== "__POOL__")
      .flatMap((t: { items: Array<{ id: string }> }) => t.items);

    let order = 0;
    for (const item of allItems) {
      await prisma.tierItem.update({
        where: { id: item.id },
        data: { tierId: poolTier.id, order: order++ },
      });
    }

    console.log(`Reset: ${title} (${allItems.length} items moved to pool)`);
  }

  console.log("Reset completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
