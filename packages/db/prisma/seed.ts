import { PrismaClient } from '@prisma/client'
import { createKeyId } from 'lucia'
import { generateLuciaPasswordHash } from 'lucia/utils'
import 'lucia/polyfill/node'

const prisma = new PrismaClient()

async function seed() {
  // seed default roles
  const adminRole = await prisma.role.create({
    data: {
      name: 'ADMIN',
    },
  })

  const userRole = await prisma.role.create({
    data: {
      name: 'USER',
    },
  })

  console.log(`Roles data has been seeded. 🌱`)

  await prisma.user.create({
    data: {
      email: 'admin@mail.com',
      name: 'Admin',
      role: {
        connect: {
          id: adminRole.id,
        },
      },
      key: {
        create: {
          id: createKeyId('email', 'admin@mail.com'),
          hashed_password: await generateLuciaPasswordHash('12345678'),
        },
      },
    },
  })

  await prisma.user.create({
    data: {
      email: 'user@mail.com',
      name: 'User',
      role: {
        connect: {
          id: userRole.id,
        },
      },
      key: {
        create: {
          id: createKeyId('email', 'user@mail.com'),
          hashed_password: await generateLuciaPasswordHash('12345678'),
        },
      },
    },
  })

  console.log(`Users data has been seeded. 🌱`)

  console.log(`Database has been seeded. 🌱`)
}

seed()
  .catch((e) => {
    console.log(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
