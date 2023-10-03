import { prisma } from '@travel-app/db';

export async function findDestinationById(id: string) {
  try {
    const destination = await prisma.destination.findFirst({
      where: {
        AND: [{ id }, { deletedAt: null }],
      },
      select: {
        id: true,
      },
    });

    if (!destination) {
      return {
        data: undefined,
        error: {
          code: 'NOT_FOUND',
          message: 'Destinatin not found',
        },
      } as const;
    }

    return { data: true, error: undefined } as const;
  } catch (e) {
    return {
      data: undefined,
      error: {
        code: 'INTERNAL',
        message: 'Something went wrong',
      },
    } as const;
  }
}
