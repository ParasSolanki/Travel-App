import { prisma } from '@travel-app/db';

export async function getSessionUserData(userId: string) {
  const user = await prisma.user.findFirst({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      address: true,
      name: true,
      phone: true,
      role: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!user) throw new Error('No user found');

  return user;
}
