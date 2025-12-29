/* eslint-disable @typescript-eslint/no-require-imports */
// Load env FIRST before any other imports
const dotenv = require("dotenv");
dotenv.config({ override: true });

// Use standard pg Pool for CLI seeding (not edge runtime)
const { PrismaClient } = require("@prisma/client");
const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("DATABASE_URL is not set. Please configure it in your .env file.");
  process.exit(1);
}

console.log("DATABASE_URL loaded:", databaseUrl.substring(0, 30) + "...");
console.log("Connecting to database...");

const pool = new Pool({ connectionString: databaseUrl });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Sample tier list data
const DEMO_TIERLISTS = [
  {
    title: "Best Video Games Ever",
    description: "A ranking of the greatest video games of all time",
    coverImageUrl: "https://images.unsplash.com/photo-1493711662062-fa541f7f3d24?w=600",
    tiers: [
      {
        name: "S",
        color: "#ff7f7f",
        items: [
          { label: "The Legend of Zelda: BOTW", mediaUrl: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=200" },
          { label: "Elden Ring", mediaUrl: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=200" },
        ],
      },
      {
        name: "A",
        color: "#ffbf7f",
        items: [
          { label: "Red Dead Redemption 2", mediaUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=200" },
          { label: "God of War", mediaUrl: "https://images.unsplash.com/photo-1552820728-8b83bb6b2b0d?w=200" },
        ],
      },
      {
        name: "B",
        color: "#ffdf7f",
        items: [
          { label: "Minecraft", mediaUrl: "https://images.unsplash.com/photo-1587573089734-09cb69c0f2b4?w=200" },
        ],
      },
      {
        name: "C",
        color: "#7fff7f",
        items: [],
      },
    ],
  },
  {
    title: "Top Marvel Movies Ranked",
    description: "The ultimate Marvel Cinematic Universe tier list",
    coverImageUrl: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=600",
    tiers: [
      {
        name: "S",
        color: "#ff7f7f",
        items: [
          { label: "Avengers: Endgame", mediaUrl: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=200" },
          { label: "Avengers: Infinity War", mediaUrl: "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=200" },
        ],
      },
      {
        name: "A",
        color: "#ffbf7f",
        items: [
          { label: "Spider-Man: No Way Home", mediaUrl: "https://images.unsplash.com/photo-1604200213928-ba3cf4fc8436?w=200" },
          { label: "Guardians of the Galaxy", mediaUrl: "https://images.unsplash.com/photo-1534809027769-b00d750a6bac?w=200" },
        ],
      },
      {
        name: "B",
        color: "#ffdf7f",
        items: [
          { label: "Thor: Ragnarok", mediaUrl: "https://images.unsplash.com/photo-1505533542167-8c89838bb19e?w=200" },
        ],
      },
      {
        name: "C",
        color: "#7fff7f",
        items: [],
      },
    ],
  },
  {
    title: "Pizza Toppings Tier List",
    description: "What belongs on a pizza? Here's my definitive ranking",
    coverImageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600",
    tiers: [
      {
        name: "S",
        color: "#ff7f7f",
        items: [
          { label: "Pepperoni", mediaUrl: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=200" },
          { label: "Mozzarella", mediaUrl: "https://images.unsplash.com/photo-1589881133595-a3c085cb731d?w=200" },
        ],
      },
      {
        name: "A",
        color: "#ffbf7f",
        items: [
          { label: "Mushrooms", mediaUrl: "https://images.unsplash.com/photo-1504545102780-26774c1bb073?w=200" },
          { label: "Italian Sausage", mediaUrl: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=200" },
        ],
      },
      {
        name: "B",
        color: "#ffdf7f",
        items: [
          { label: "Olives", mediaUrl: "https://images.unsplash.com/photo-1563060537863-56f77ea5e3e3?w=200" },
        ],
      },
      {
        name: "D",
        color: "#ff7f7f",
        items: [
          { label: "Pineapple", mediaUrl: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=200" },
        ],
      },
    ],
  },
  {
    title: "Greatest Anime of All Time",
    description: "My personal ranking of the best anime series ever made",
    coverImageUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600",
    tiers: [
      {
        name: "S",
        color: "#ff7f7f",
        items: [
          { label: "Attack on Titan", mediaUrl: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=200" },
          { label: "Fullmetal Alchemist", mediaUrl: "https://images.unsplash.com/photo-1613376023733-0a73315d9b06?w=200" },
        ],
      },
      {
        name: "A",
        color: "#ffbf7f",
        items: [
          { label: "Death Note", mediaUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200" },
          { label: "One Piece", mediaUrl: "https://images.unsplash.com/photo-1601850494422-3cf14624b0b3?w=200" },
        ],
      },
      {
        name: "B",
        color: "#ffdf7f",
        items: [
          { label: "Naruto", mediaUrl: "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=200" },
        ],
      },
      {
        name: "C",
        color: "#7fff7f",
        items: [],
      },
    ],
  },
  {
    title: "Best Music Artists 2020s",
    description: "Ranking the top music artists of the decade",
    coverImageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600",
    tiers: [
      {
        name: "S",
        color: "#ff7f7f",
        items: [
          { label: "The Weeknd", mediaUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200" },
          { label: "Kendrick Lamar", mediaUrl: "https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=200" },
        ],
      },
      {
        name: "A",
        color: "#ffbf7f",
        items: [
          { label: "Taylor Swift", mediaUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=200" },
          { label: "Bad Bunny", mediaUrl: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=200" },
        ],
      },
      {
        name: "B",
        color: "#ffdf7f",
        items: [
          { label: "Drake", mediaUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=200" },
        ],
      },
      {
        name: "C",
        color: "#7fff7f",
        items: [],
      },
    ],
  },
  {
    title: "Football Legends Ranked",
    description: "The greatest football players of all time - who's the GOAT?",
    coverImageUrl: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600",
    tiers: [
      {
        name: "GOAT",
        color: "#ffd700",
        items: [
          { label: "Messi", mediaUrl: "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=200" },
          { label: "Ronaldo", mediaUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=200" },
        ],
      },
      {
        name: "Legend",
        color: "#ff7f7f",
        items: [
          { label: "Maradona", mediaUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=200" },
          { label: "Pele", mediaUrl: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=200" },
        ],
      },
      {
        name: "Elite",
        color: "#ffbf7f",
        items: [
          { label: "Zidane", mediaUrl: "https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?w=200" },
        ],
      },
      {
        name: "Great",
        color: "#7fff7f",
        items: [],
      },
    ],
  },
];

async function main() {
  console.log("Seeding demo tier lists...");

  for (const tierlistData of DEMO_TIERLISTS) {
    const tierlist = await prisma.tierList.create({
      data: {
        title: tierlistData.title,
        description: tierlistData.description,
        coverImageUrl: tierlistData.coverImageUrl,
        isPublic: true,
        anonymousId: `demo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      },
    });

    for (let tierIndex = 0; tierIndex < tierlistData.tiers.length; tierIndex++) {
      const tierData = tierlistData.tiers[tierIndex];

      const tier = await prisma.tier.create({
        data: {
          name: tierData.name,
          color: tierData.color,
          order: tierIndex,
          tierListId: tierlist.id,
        },
      });

      for (let itemIndex = 0; itemIndex < tierData.items.length; itemIndex++) {
        const itemData = tierData.items[itemIndex];

        await prisma.tierItem.create({
          data: {
            mediaUrl: itemData.mediaUrl,
            mediaType: "IMAGE",
            label: itemData.label,
            order: itemIndex,
            tierId: tier.id,
          },
        });
      }
    }

    console.log(`Created: ${tierlistData.title}`);
  }

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
