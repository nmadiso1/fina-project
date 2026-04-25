const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Only seed if database is empty to avoid wiping data on every restart
  const userCount = await prisma.user.count();
  if (userCount > 0) {
    console.log('✨ Database already has data. Skipping seed.');
    return;
  }

  console.log('🌱 Database is empty. Starting seed...');

  const hashedPassword = await bcrypt.hash('Password123!', 10);

  // Create test users
  const user1 = await prisma.user.create({
    data: { email: 'owner@example.com', password: hashedPassword },
  });

  const user2 = await prisma.user.create({
    data: { email: 'not-owner@example.com', password: hashedPassword },
  });

  console.log(`   ✅ Created users: ${user1.email}, ${user2.email}`);

  // Create portfolios for user1
  const portfolio1 = await prisma.portfolio.create({
    data: {
      userId: user1.id,
      name: 'Retirement Portfolio',
      description: 'Long-term investments',
    },
  });

  const portfolio2 = await prisma.portfolio.create({
    data: {
      userId: user1.id,
      name: 'Growth Portfolio',
      description: 'High-growth tech stocks',
    },
  });

  // Create a portfolio for user2
  const portfolio3 = await prisma.portfolio.create({
    data: {
      userId: user2.id,
      name: 'Other User Portfolio',
      description: 'Belongs to not-owner',
    },
  });

  console.log(`   ✅ Created portfolios`);

  // Create holdings
  const holding1 = await prisma.holding.create({
    data: {
      portfolioId: portfolio1.id,
      tickerSymbol: 'AAPL',
      quantity: 20,
      averageCost: 150.0,
    },
  });

  const holding2 = await prisma.holding.create({
    data: {
      portfolioId: portfolio1.id,
      tickerSymbol: 'MSFT',
      quantity: 10,
      averageCost: 310.0,
    },
  });

  const holding3 = await prisma.holding.create({
    data: {
      portfolioId: portfolio2.id,
      tickerSymbol: 'NVDA',
      quantity: 5,
      averageCost: 450.0,
    },
  });

  console.log(`   ✅ Created holdings`);

  // Create transactions
  await prisma.transaction.createMany({
    data: [
      {
        holdingId: holding1.id,
        type: 'BUY',
        quantity: 20,
        price: 150.0,
        executedAt: new Date('2024-01-15'),
      },
      {
        holdingId: holding2.id,
        type: 'BUY',
        quantity: 15,
        price: 300.0,
        executedAt: new Date('2024-02-01'),
      },
      {
        holdingId: holding2.id,
        type: 'SELL',
        quantity: 5,
        price: 320.0,
        executedAt: new Date('2024-03-10'),
      },
      {
        holdingId: holding3.id,
        type: 'BUY',
        quantity: 5,
        price: 450.0,
        executedAt: new Date('2024-04-01'),
      },
    ],
  });

  console.log(`   ✅ Created transactions`);
  console.log('\n🎉 Database seeded successfully!');
  console.log('\nTest credentials:');
  console.log('  owner@example.com     / Password123!');
  console.log('  not-owner@example.com / Password123!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
