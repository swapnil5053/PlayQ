const admin = require('firebase-admin');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const serviceAccount = require('../firebase-service-account.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

const games = [
  {
    id: "cyber-strike",
    name: "Cyber Strike",
    description: "Immerse yourself in this fast-paced cyberpunk shooter. Battle through neon-lit streets and defeat rogue AI bosses.",
    genre: "Shooter",
    imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop", // real arcade cabinet / gaming screen
    maxPlayers: 4,
    difficulty: "Hard",
    rating: 4.8,
    computedWaitMinutes: 15,
    queueLength: 3,
    isAvailable: true,
    machineLocation: "Zone A"
  },
  {
    id: "neon-riders",
    name: "Neon Riders",
    description: "Race at breakneck speeds on futuristic light cycles. Dodge obstacles and leave your opponents in the dust.",
    genre: "Racing",
    imageUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&auto=format&fit=crop", // retro synthwave style
    maxPlayers: 8,
    difficulty: "Medium",
    rating: 4.5,
    computedWaitMinutes: 5,
    queueLength: 1,
    isAvailable: true,
    machineLocation: "Zone B"
  },
  {
    id: "pixel-brawler",
    name: "Pixel Brawler",
    description: "Classic 16-bit beat 'em up action. Choose your fighter and battle through waves of enemies in retro style.",
    genre: "Fighting",
    imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop", // retro setup
    maxPlayers: 2,
    difficulty: "Medium",
    rating: 4.2,
    computedWaitMinutes: 0,
    queueLength: 0,
    isAvailable: true,
    machineLocation: "Zone C"
  },
  {
    id: "galaxy-defender",
    name: "Galaxy Defender",
    description: "Pilot your starship and defend the galaxy from alien invaders. A modern take on the classic arcade space shooter.",
    genre: "Arcade",
    imageUrl: "https://images.unsplash.com/photo-1614294149010-950b698f72c0?q=80&w=800&auto=format&fit=crop", // space / arcade neon
    maxPlayers: 1,
    difficulty: "Easy",
    rating: 4.6,
    computedWaitMinutes: 10,
    queueLength: 2,
    isAvailable: true,
    machineLocation: "Zone A"
  },
  {
    id: "rhythm-master",
    name: "Rhythm Master",
    description: "Hit the beats and feel the music. The ultimate rhythm game experience with a massive library of EDM tracks.",
    genre: "Music",
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a1a2a5f5f4b5?q=80&w=800&auto=format&fit=crop", // dj/music neon
    maxPlayers: 2,
    difficulty: "Hard",
    rating: 4.9,
    computedWaitMinutes: 25,
    queueLength: 5,
    isAvailable: true,
    machineLocation: "Zone D"
  },
  {
    id: "street-fighter-retro",
    name: "Street Fighter Retro",
    description: "The classic competitive fighting game that started it all. Challenge challengers and become the champion.",
    genre: "Fighting",
    imageUrl: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?q=80&w=800&auto=format&fit=crop", // arcade joystick / fighting
    maxPlayers: 2,
    difficulty: "Hard",
    rating: 4.9,
    computedWaitMinutes: 12,
    queueLength: 4,
    isAvailable: true,
    machineLocation: "Zone B"
  },
  {
    id: "pac-maze",
    name: "Pac Maze",
    description: "Navigate the neon maze, eat the dots, and avoid the ghosts. A timeless arcade classic.",
    genre: "Arcade",
    imageUrl: "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?q=80&w=800&auto=format&fit=crop", // maze / retro lighting
    maxPlayers: 1,
    difficulty: "Medium",
    rating: 4.7,
    computedWaitMinutes: 2,
    queueLength: 1,
    isAvailable: true,
    machineLocation: "Zone C"
  },
  {
    id: "virtual-hoops",
    name: "Virtual Hoops",
    description: "Test your skills in this realistic VR basketball simulation. Compete for the highest score before time runs out.",
    genre: "Sports",
    imageUrl: "https://images.unsplash.com/photo-1622556498246-755f44ca76f3?q=80&w=800&auto=format&fit=crop", // vr / neon sports
    maxPlayers: 1,
    difficulty: "Easy",
    rating: 4.4,
    computedWaitMinutes: 8,
    queueLength: 2,
    isAvailable: true,
    machineLocation: "Zone D"
  }
];

async function seed() {
  console.log('Seeding games to Firestore...');
  const batch = db.batch();
  
  games.forEach(game => {
    const docRef = db.collection('games').doc(game.id);
    batch.set(docRef, game);
  });

  await batch.commit();
  console.log('✅ Successfully seeded 5 games!');
  process.exit(0);
}

seed().catch(err => {
  console.error('Failed to seed:', err);
  process.exit(1);
});
