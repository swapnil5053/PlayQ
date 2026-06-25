import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Categories
  const action = await prisma.gameCategory.upsert({
    where: { slug: 'action' },
    update: {},
    create: { name: 'Action', slug: 'action', icon: 'zap' }
  });
  const racing = await prisma.gameCategory.upsert({
    where: { slug: 'racing' },
    update: {},
    create: { name: 'Racing', slug: 'racing', icon: 'flag' }
  });
  const fighting = await prisma.gameCategory.upsert({
    where: { slug: 'fighting' },
    update: {},
    create: { name: 'Fighting', slug: 'fighting', icon: 'swords' }
  });

  // 2. Games
  const neonRacer = await prisma.game.upsert({
    where: { slug: 'neon-racer' },
    update: { imageUrl: 'https://images.unsplash.com/photo-1547394765-185e1e68f34e?q=80&w=800' },
    create: {
      title: 'Neon Racer',
      slug: 'neon-racer',
      description: 'Burn rubber through a synthwave cityscape.',
      imageUrl: 'https://images.unsplash.com/photo-1547394765-185e1e68f34e?q=80&w=800',
      categoryId: racing.id,
      difficulty: 'HARD',
      rating: 4.8,
      avgScore: 18400,
      crowdLevel: 'LOW',
      estimatedWaitMin: 5,
      queueCapacity: 10
    }
  });

  const zombieBlast = await prisma.game.upsert({
    where: { slug: 'zombie-blast' },
    update: { imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800' },
    create: {
      title: 'Zombie Blast',
      slug: 'zombie-blast',
      description: 'Survive endless waves of the undead.',
      imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800',
      categoryId: action.id,
      difficulty: 'MEDIUM',
      rating: 4.5,
      avgScore: 12750,
      crowdLevel: 'LOW',
      estimatedWaitMin: 10,
      queueCapacity: 12
    }
  });

  const pixelPunch = await prisma.game.upsert({
    where: { slug: 'pixel-punch' },
    update: { imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800' },
    create: {
      title: 'Pixel Punch',
      slug: 'pixel-punch',
      description: 'Old-school brawler with pixel-perfect combos.',
      imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800',
      categoryId: fighting.id,
      difficulty: 'HARD',
      rating: 4.7,
      avgScore: 9800,
      crowdLevel: 'HIGH',
      estimatedWaitMin: 25,
      queueCapacity: 8
    }
  });

  const spaceInvaders = await prisma.game.upsert({
    where: { slug: 'space-invaders' },
    update: { imageUrl: 'https://images.unsplash.com/photo-1614294149010-950b698f72c0?q=80&w=800' },
    create: {
      title: 'Space Invaders 3D',
      slug: 'space-invaders',
      description: 'Defend earth in immersive 3D space.',
      imageUrl: 'https://images.unsplash.com/photo-1614294149010-950b698f72c0?q=80&w=800',
      categoryId: action.id,
      difficulty: 'MEDIUM',
      rating: 4.6,
      avgScore: 21500,
      crowdLevel: 'MEDIUM',
      estimatedWaitMin: 15,
      queueCapacity: 10
    }
  });

  const danceGroove = await prisma.game.upsert({
    where: { slug: 'dance-groove' },
    update: { imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800' },
    create: {
      title: 'Dance Groove',
      slug: 'dance-groove',
      description: 'Feel the rhythm and hit the arrows on beat.',
      imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800',
      categoryId: action.id,
      difficulty: 'HARD',
      rating: 4.9,
      avgScore: 34000,
      crowdLevel: 'HIGH',
      estimatedWaitMin: 30,
      queueCapacity: 15
    }
  });

  const neonPinball = await prisma.game.upsert({
    where: { slug: 'neon-pinball' },
    update: { imageUrl: 'https://images.unsplash.com/photo-1518544801976-3e159e50e5bb?q=80&w=800' },
    create: {
      title: 'Neon Pinball',
      slug: 'neon-pinball',
      description: 'Classic pinball with a neon twist.',
      imageUrl: 'https://images.unsplash.com/photo-1518544801976-3e159e50e5bb?q=80&w=800',
      categoryId: action.id,
      difficulty: 'EASY',
      rating: 4.4,
      avgScore: 1500000,
      crowdLevel: 'LOW',
      estimatedWaitMin: 0,
      queueCapacity: 5
    }
  });

  // 3. Queues
  await prisma.queue.upsert({
    where: { gameId: neonRacer.id },
    update: {},
    create: { gameId: neonRacer.id, maxCapacity: 10, currentLength: 0, avgTurnMinutes: 5 }
  });

  await prisma.queue.upsert({
    where: { gameId: zombieBlast.id },
    update: {},
    create: { gameId: zombieBlast.id, maxCapacity: 12, currentLength: 0, avgTurnMinutes: 6 }
  });

  await prisma.queue.upsert({
    where: { gameId: pixelPunch.id },
    update: {},
    create: { gameId: pixelPunch.id, maxCapacity: 8, currentLength: 0, avgTurnMinutes: 4 }
  });

  await prisma.queue.upsert({
    where: { gameId: spaceInvaders.id },
    update: {},
    create: { gameId: spaceInvaders.id, maxCapacity: 10, currentLength: 0, avgTurnMinutes: 3 }
  });

  await prisma.queue.upsert({
    where: { gameId: danceGroove.id },
    update: {},
    create: { gameId: danceGroove.id, maxCapacity: 15, currentLength: 0, avgTurnMinutes: 5 }
  });

  await prisma.queue.upsert({
    where: { gameId: neonPinball.id },
    update: {},
    create: { gameId: neonPinball.id, maxCapacity: 5, currentLength: 0, avgTurnMinutes: 2 }
  });

  // 4. Dummy User & Historical Data
  const dummyPassword = await bcrypt.hash('password123', 10);
  const dummyUser = await prisma.user.upsert({
    where: { email: 'player@thearcade.com' },
    update: {},
    create: {
      email: 'player@thearcade.com',
      displayName: 'Player One',
      passwordHash: dummyPassword,
    }
  });

  // Create a session
  const session = await prisma.session.create({
    data: {
      userId: dummyUser.id,
      totalMinutes: 120,
    }
  });

  // Create some historical scores for the graph
  const today = new Date();
  const pastDates = [5, 4, 3, 2, 1, 0].map(daysAgo => {
    const d = new Date(today);
    d.setDate(d.getDate() - daysAgo);
    return d;
  });

  // Neon Racer scores
  for (let i = 0; i < pastDates.length; i++) {
    await prisma.score.create({
      data: {
        value: 15000 + (i * 500) + Math.floor(Math.random() * 1000),
        gameId: neonRacer.id,
        userId: dummyUser.id,
        sessionId: session.id,
        playedAt: pastDates[i],
        isPersonalBest: i === pastDates.length - 1
      }
    });
  }

  console.log('Database seeded successfully. You can log in with player@thearcade.com / password123');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
