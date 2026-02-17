import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import * as dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clean up existing data (optional, but good for dev)
  try {
    await prisma.intervention.deleteMany()
    await prisma.machine.deleteMany()
    await prisma.client.deleteMany()
    await prisma.user.deleteMany()
    // Force delete to clear unique constraint issues if deleteMany fails silently
    const users = await prisma.user.findMany();
    for (const user of users) {
        await prisma.user.delete({ where: { id: user.id } });
    }
  } catch (e) {
    console.log("Cleanup failed (expected on first run or schema mismatch):", e)
  }

  // 1. Create Admin User
  const adminPassword = await bcrypt.hash('admin123', 10)
  // Check if admin exists first
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@matrix-tech.fr' }
  })

  let admin;
  if (existingAdmin) {
    admin = await prisma.user.update({
      where: { email: 'admin@matrix-tech.fr' },
      data: {
        username: 'admin',
      },
    })
  } else {
    admin = await prisma.user.create({
      data: {
        email: 'admin@matrix-tech.fr',
        username: 'admin',
        passwordHash: adminPassword,
        firstName: 'Admin',
        lastName: 'System',
        role: 'ADMIN',
        phone: '+33612345678',
      },
    })
  }
  console.log(`Created/Updated admin: ${admin.email}`)

  // 2. Create Technician User
  const techPassword = await bcrypt.hash('tech123', 10)
  const existingTech = await prisma.user.findUnique({
    where: { email: 'tech@matrix-tech.fr' }
  })

  let technician;
  if (existingTech) {
    technician = await prisma.user.update({
        where: { email: 'tech@matrix-tech.fr' },
        data: {
            username: 'tech_thomas',
        }
    })
  } else {
    technician = await prisma.user.create({
        data: {
            email: 'tech@matrix-tech.fr',
            username: 'tech_thomas',
            passwordHash: techPassword,
            firstName: 'Thomas',
            lastName: 'Technicien',
            role: 'TECHNICIAN',
            phone: '+33698765432',
            address: '10 Rue de la Paix, 75002 Paris',
            skills: ['Cardio', 'Musculation', 'Habilitation Élec B1'],
            vehicleId: 'AB-123-CD',
        },
    })
  }
  console.log(`Created technician: ${technician.email}`)

  // 3. Create a Client (Gym)
  const client = await prisma.client.create({
    data: {
      name: 'Fitness Park Paris 12',
      type: 'Gym',
      address: '123 Avenue Daumesnil',
      city: 'Paris',
      zipCode: '75012',
      contactName: 'Marc Directeur',
      contactPhone: '+33123456789',
      contactEmail: 'contact@fitnesspark12.fr',
    },
  })
  console.log(`Created client: ${client.name}`)

  // 4. Create a Machine
  const machine = await prisma.machine.create({
    data: {
      serialNumber: 'TMX-2024-001',
      model: 'Treadmill T7xi',
      type: 'Treadmill',
      installDate: new Date('2023-01-15'),
      clientId: client.id,
    },
  })
  console.log(`Created machine: ${machine.model} (${machine.serialNumber})`)

  // 5. Create an Intervention
  const intervention = await prisma.intervention.create({
    data: {
      ticketId: 'INT-2024-001',
      description: 'Tapis de course ne démarre plus. Erreur E12 affichée.',
      status: 'ASSIGNED',
      priority: 'HIGH',
      scheduledAt: new Date('2024-02-20T10:00:00Z'),
      technicianId: technician.id,
      clientId: client.id,
      machineId: machine.id,
    },
  })
  console.log(`Created intervention: ${intervention.ticketId}`)

  console.log('✅ Seeding completed.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
