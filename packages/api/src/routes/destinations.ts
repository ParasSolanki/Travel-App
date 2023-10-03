import { prisma } from '@travel-app/db';
import { protectedRouter } from '../protected-app.js';
import { isAdmin } from '../utils/is-admin.js';

async function doesDestinationExistsWithNameOrShortCode({
  name,
  shortCode,
  destinationId,
}: {
  name: string;
  shortCode: string;
  destinationId?: string;
}) {
  try {
    const destination = await prisma.destination.findFirst({
      where: {
        AND: [
          { deletedAt: null },
          {
            NOT: { id: destinationId },
          },
          {
            OR: [
              { name: { equals: name } },
              { shortCode: { equals: shortCode } },
            ],
          },
        ],
      },
      select: {
        id: true,
        name: true,
        shortCode: true,
      },
    });

    if (destination) {
      if (destination.name === name) {
        return {
          data: undefined,
          error: {
            code: 'DUPLICATE',
            message: 'Destination with name already exists',
          },
        } as const;
      }
      if (destination.shortCode === shortCode) {
        return {
          data: undefined,
          error: {
            code: 'DUPLICATE',
            message: 'Destination with short code already exists',
          },
        } as const;
      }
    }

    return { data: true, error: undefined } as const;
  } catch (e) {
    return {
      data: undefined,
      error: { code: 'INTERNAL', message: 'Something went wrong' },
    } as const;
  }
}

export async function doesDestinationExistsById(destinationId: string) {
  try {
    const destination = await prisma.destination.findFirst({
      where: {
        id: destinationId,
        deletedAt: null,
      },
      select: {
        id: true,
      },
    });

    if (!destination)
      return {
        data: undefined,
        error: { code: 'NOT_FOUND', message: 'Destination does not exists' },
      } as const;

    return { data: destination, error: undefined } as const;
  } catch (e) {
    return {
      data: undefined,
      error: { code: 'INTERNAL', message: 'Something went wrong' },
    } as const;
  }
}

// get destinations
protectedRouter.get('/api/destinations', async (req, res) => {
  const { search, page, perPage } = req.query;

  try {
    const where = {
      AND: [
        {
          deletedAt: null,
        },
        {
          OR: [
            { name: { contains: search } },
            { shortCode: { contains: search } },
          ],
        },
      ],
    };

    const [total, destinations] = await prisma.$transaction([
      prisma.destination.count({
        where,
      }),
      prisma.destination.findMany({
        where,
        orderBy: {
          createdAt: 'desc',
        },
        take: perPage,
        skip: page > 0 ? perPage * page : 0,
        select: {
          id: true,
          name: true,
          shortCode: true,
        },
      }),
    ]);

    res.status(200).json({
      ok: true,
      data: {
        destinations,
        pagination: {
          page,
          total: Math.ceil(total / perPage),
        },
      },
    });
  } catch (e) {
    res.status(500).json({
      ok: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong',
      },
    });
  }
});

// get all destinations
protectedRouter.get('/api/destinations/all', async (_req, res) => {
  try {
    const destinations = await prisma.destination.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: [{ name: 'asc' }, { createdAt: 'desc' }],
      select: {
        id: true,
        name: true,
        shortCode: true,
      },
    });

    res.status(200).json({
      ok: true,
      data: {
        destinations,
      },
    });
  } catch (e) {
    res.status(500).json({
      ok: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong',
      },
    });
  }
});

// add destination
protectedRouter.post('/api/destinations', async (req, res) => {
  const user = res.locals.user;
  const { name, shortCode } = req.body;

  if (!isAdmin(user.role.name)) {
    return res.status(403).json({
      ok: false,
      error: {
        code: 'FORBIDDEN',
        message: 'You do not have permission to perform this action',
      },
    });
  }

  const { error } = await doesDestinationExistsWithNameOrShortCode({
    name,
    shortCode,
  });

  if (error) {
    if (error.code === 'DUPLICATE') {
      return res.status(409).json({
        ok: false,
        error: {
          code: 'CONFLICT',
          message: error.message,
        },
      });
    }
    return res.status(500).json({
      ok: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong',
      },
    });
  }

  try {
    const destination = await prisma.destination.create({
      data: {
        name,
        shortCode,
        createdBy: {
          connect: {
            id: user.id,
          },
        },
      },
      select: {
        id: true,
        name: true,
        shortCode: true,
      },
    });

    res.status(201).json({
      ok: true,
      data: {
        destination,
      },
    });
  } catch (e) {
    res.status(500).json({
      ok: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong',
      },
    });
  }
});

// update destination
protectedRouter.put('/api/destination/:id', async (req, res) => {
  const id = req.params.id;
  const user = res.locals.user;
  const { name, shortCode } = req.body;

  if (!isAdmin(user.role.name)) {
    return res.status(403).json({
      ok: false,
      error: {
        code: 'FORBIDDEN',
        message: 'You do not have permission to perform this action',
      },
    });
  }

  const { error } = await doesDestinationExistsWithNameOrShortCode({
    name,
    shortCode,
    destinationId: id,
  });

  if (error) {
    if (error.code === 'DUPLICATE') {
      return res.status(409).json({
        ok: false,
        error: {
          code: 'CONFLICT',
          message: error.message,
        },
      });
    }
    return res.status(500).json({
      ok: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong',
      },
    });
  }

  try {
    await prisma.destination.update({
      where: {
        id,
      },
      data: {
        name,
        shortCode,
        updatedBy: {
          connect: {
            id: user.id,
          },
        },
      },
      select: {
        id: true,
      },
    });

    res.status(200).json({
      ok: true,
    });
  } catch (e) {
    res.status(500).json({
      ok: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong',
      },
    });
  }
});

// delete destination
protectedRouter.delete('/api/destination/:id', async (req, res) => {
  const id = req.params.id;
  const user = res.locals.user;

  if (!isAdmin(user.role.name)) {
    return res.status(403).json({
      ok: false,
      error: {
        code: 'FORBIDDEN',
        message: 'You do not have permission to perform this action',
      },
    });
  }

  try {
    const destination = await prisma.destination.findFirst({
      where: {
        id,
      },
      select: {
        id: true,
        deletedAt: true,
      },
    });

    // if destination has deleted at means its already deleted send 404 because we have soft deleted it
    if (!destination || destination?.deletedAt) {
      return res.status(404).json({
        ok: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Destination not found',
        },
      });
    }

    await prisma.destination.update({
      where: {
        id,
      },
      data: {
        updatedBy: {
          connect: {
            id: user.id,
          },
        },
        deletedAt: new Date(),
      },
    });

    res.status(200).json({
      ok: true,
    });
  } catch (e) {
    res.status(500).json({
      ok: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong',
      },
    });
  }
});
