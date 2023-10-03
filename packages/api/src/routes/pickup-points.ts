import { prisma } from '@travel-app/db';
import { protectedRouter } from '../protected-app.js';
import { isAdmin } from '../utils/is-admin.js';
import { doesDestinationExistsById } from './destinations.js';

async function doesPickupPointExistsWithName({
  name,
  destinationId,
  pickupPointId,
}: {
  name: string;
  destinationId: string;
  pickupPointId?: string;
}) {
  try {
    const pickupPoint = await prisma.pickupPoint.findFirst({
      where: {
        AND: [
          { deletedAt: null },
          {
            NOT: { id: pickupPointId },
          },
          {
            name: { equals: name },
          },
          {
            destinationId,
          },
        ],
      },
      select: {
        id: true,
      },
    });

    if (pickupPoint) {
      return {
        data: undefined,
        error: {
          code: 'DUPLICATE',
          message: 'Pickup point with name already exists',
        },
      } as const;
    }

    return { data: true, error: undefined } as const;
  } catch (e) {
    return {
      data: undefined,
      error: { code: 'INTERNAL', message: 'Something went wrong' },
    } as const;
  }
}

// get pickup points
protectedRouter.get('/api/pickup-points', async (req, res) => {
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
            {
              destination: {
                name: { contains: search },
              },
            },
          ],
        },
      ],
    };

    const [total, pickupPoints] = await prisma.$transaction([
      prisma.pickupPoint.count({
        where,
      }),
      prisma.pickupPoint.findMany({
        where,
        orderBy: {
          createdAt: 'desc',
        },
        take: perPage,
        skip: page > 0 ? perPage * page : 0,
        select: {
          id: true,
          name: true,
          destination: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
    ]);

    res.status(200).json({
      ok: true,
      data: {
        pickupPoints,
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

// get all pickup points
protectedRouter.get('/api/pickup-points/all', async (_req, res) => {
  try {
    const pickupPoints = await prisma.pickupPoint.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        name: true,
        destination: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.status(200).json({
      ok: true,
      data: {
        pickupPoints,
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

// add pickup point
protectedRouter.post('/api/pickup-points', async (req, res) => {
  const user = res.locals.user;
  const { name, destinationId } = req.body;

  if (!isAdmin(user.role.name)) {
    return res.status(403).json({
      ok: false,
      error: {
        code: 'FORBIDDEN',
        message: 'You do not have permission to perform this action',
      },
    });
  }

  const { error: pickupPointError } = await doesPickupPointExistsWithName({
    name,
    destinationId,
  });
  const { error: destinationError } =
    await doesDestinationExistsById(destinationId);

  if (pickupPointError || destinationError) {
    if (pickupPointError && pickupPointError.code === 'DUPLICATE') {
      return res.status(409).json({
        ok: false,
        error: {
          code: 'CONFLICT',
          message: pickupPointError.message,
        },
      });
    }
    if (destinationError && destinationError.code === 'NOT_FOUND') {
      return res.status(400).json({
        ok: false,
        error: {
          code: 'BAD_REQUEST',
          message: destinationError.message,
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
    const pickupPoint = await prisma.pickupPoint.create({
      data: {
        name,
        destination: {
          connect: {
            id: destinationId,
          },
        },
        createdBy: {
          connect: {
            id: user.id,
          },
        },
      },
      select: {
        id: true,
        name: true,
        destination: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.status(201).json({
      ok: true,
      data: {
        pickupPoint,
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

// update pickup point
protectedRouter.put('/api/pickup-point/:id', async (req, res) => {
  const id = req.params.id;
  const user = res.locals.user;
  const { name, destinationId } = req.body;

  if (!isAdmin(user.role.name)) {
    return res.status(403).json({
      ok: false,
      error: {
        code: 'FORBIDDEN',
        message: 'You do not have permission to perform this action',
      },
    });
  }

  const { error: pickupPointError } = await doesPickupPointExistsWithName({
    name,
    destinationId,
    pickupPointId: id,
  });
  const { error: destinationError } =
    await doesDestinationExistsById(destinationId);

  if (pickupPointError || destinationError) {
    if (pickupPointError && pickupPointError.code === 'DUPLICATE') {
      return res.status(409).json({
        ok: false,
        error: {
          code: 'CONFLICT',
          message: pickupPointError.message,
        },
      });
    }
    if (destinationError && destinationError.code === 'NOT_FOUND') {
      return res.status(400).json({
        ok: false,
        error: {
          code: 'BAD_REQUEST',
          message: destinationError.message,
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
    await prisma.pickupPoint.update({
      where: {
        id,
      },
      data: {
        name,
        destination: {
          connect: {
            id: destinationId,
          },
        },
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

// delete pickup point
protectedRouter.delete('/api/pickup-point/:id', async (req, res) => {
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
    const pickupPoint = await prisma.pickupPoint.findFirst({
      where: {
        id,
      },
      select: {
        id: true,
        deletedAt: true,
      },
    });

    // if pickup point has deleted at means its already deleted send 404 because we have soft deleted it
    if (!pickupPoint || pickupPoint?.deletedAt) {
      return res.status(404).json({
        ok: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Pickup point not found',
        },
      });
    }

    await prisma.pickupPoint.update({
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
