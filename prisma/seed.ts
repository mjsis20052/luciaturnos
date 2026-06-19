import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // Clean old data
  await prisma.booking.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.court.deleteMany();
  await prisma.venue.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const userPasswordHash = await bcrypt.hash('lucia123', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@cryptoarena.com',
      passwordHash: adminPasswordHash,
      name: 'Admin Arena',
      role: 'ADMIN',
    },
  });

  const user = await prisma.user.create({
    data: {
      email: 'lucia@cryptoarena.com',
      passwordHash: userPasswordHash,
      name: 'Lucía Pérez',
      role: 'USER',
    },
  });

  console.log('Seeded Users:', { admin: admin.email, user: user.email });

  // Create Venues
  const venue1 = await prisma.venue.create({
    data: {
      name: 'La Bombonera Arena',
      description: 'Ubicado en el corazón de la ciudad. Pisos de parquet profesionales pulidos, vestuarios premium y climatización de primer nivel para jugar todo el año.',
      address: 'Av. Corrientes 3400, CABA',
      image: 'https://images.unsplash.com/photo-1544698310-74ea9d1c8258?auto=format&fit=crop&q=80&w=800',
    },
  });

  const venue2 = await prisma.venue.create({
    data: {
      name: 'Rucker Park Central',
      description: 'Inspirado en el clásico de New York. Superficie acrílica de alta fricción al aire libre, iluminación nocturna tipo estadio LED de alta potencia y entorno urbano premium.',
      address: 'Bosques de Palermo, CABA',
      image: 'https://images.unsplash.com/photo-1519766304817-4f37bda74a27?auto=format&fit=crop&q=80&w=800',
    },
  });

  console.log('Seeded Venues:', [venue1.name, venue2.name]);

  // Create Courts
  const court1 = await prisma.court.create({
    data: {
      name: 'Cancha Jordan (Principal)',
      surfaceType: 'Parquet de Arce Canadiense',
      pricePerHour: 35.00,
      image: 'https://images.unsplash.com/photo-1505666287802-931dc83948e9?auto=format&fit=crop&q=80&w=600',
      venueId: venue1.id,
    },
  });

  const court2 = await prisma.court.create({
    data: {
      name: 'Cancha Kobe Bryant',
      surfaceType: 'Parquet Clásico de Roble',
      pricePerHour: 30.00,
      image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=600',
      venueId: venue1.id,
    },
  });

  const court3 = await prisma.court.create({
    data: {
      name: 'Cancha Black Mamba',
      surfaceType: 'Acrílico Profesional Cushion',
      pricePerHour: 22.00,
      image: 'https://images.unsplash.com/photo-1519766304817-4f37bda74a27?auto=format&fit=crop&q=80&w=600',
      venueId: venue2.id,
    },
  });

  const court4 = await prisma.court.create({
    data: {
      name: 'Cancha Curry (Exterior)',
      surfaceType: 'Asfalto Ultra Fricción',
      pricePerHour: 18.00,
      image: 'https://images.unsplash.com/photo-1544698310-74ea9d1c8258?auto=format&fit=crop&q=80&w=600',
      venueId: venue2.id,
    },
  });

  console.log('Seeded Courts:', [court1.name, court2.name, court3.name, court4.name]);

  // Add a sample confirmed booking for today
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const booking = await prisma.booking.create({
    data: {
      courtId: court1.id,
      userId: user.id,
      date: today,
      startTime: '18:00',
      endTime: '19:00',
      totalPrice: court1.pricePerHour,
      status: 'CONFIRMED',
    },
  });

  console.log('Seeded Sample Booking:', booking.id);
  console.log('Database seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
