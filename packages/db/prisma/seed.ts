import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const ROLE = {
  ADMIN: 'ADMIN',
  USER: 'USER',
}

async function seed() {
  // seed default roles
  await Promise.all(
    Object.values(ROLE).map((role) =>
      prisma.role.create({
        data: {
          name: role,
        },
      })
    )
  )

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
