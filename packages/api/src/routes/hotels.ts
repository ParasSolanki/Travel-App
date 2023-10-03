import { prisma } from '@travel-app/db';
import { protectedRouter } from '../protected-app.js';
import { isAdmin } from '../utils/is-admin.js';
import { findDestinationById } from '../common/services/destination.service.js';

// get hotels
protectedRouter.get('/api/hotels', async (req, res) => {
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
            { address: { contains: search } },
            { phoneNumber: { contains: search } },
            {
              destination: {
                name: { contains: search },
              },
            },
          ],
        },
      ],
    };

    const [total, hotels] = await prisma.$transaction([
      prisma.hotel.count({
        where,
      }),
      prisma.hotel.findMany({
        where,
        orderBy: {
          createdAt: 'desc',
        },
        take: perPage,
        skip: page > 0 ? perPage * page : 0,
        select: {
          id: true,
          name: true,
          email: true,
          address: true,
          phoneNumber: true,
          destination: {
            select: {
              id: true,
              name: true,
            },
          },
          roomTypes: {
            select: {
              id: true,
              type: true,
            },
          },
        },
      }),
    ]);

    res.status(200).json({
      ok: true,
      data: {
        hotels,
        pagination: {
          page,
          total: Math.ceil(total / perPage),
        },
      },
    });
  } catch (e) {
    req.log.error({ error: e });
    res.status(500).json({
      ok: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong',
      },
    });
  }
});

// add hotel
protectedRouter.post('/api/hotels', async (req, res) => {
  const user = res.locals.user;
  const { name, email, address, destinationId, phoneNumber, roomTypes } =
    req.body;

  if (!isAdmin(user.role.name)) {
    return res.status(403).json({
      ok: false,
      error: {
        code: 'FORBIDDEN',
        message: 'You do not have permission to perform this action',
      },
    });
  }

  const { error } = await findDestinationById(destinationId);

  if (error) {
    if (error.code === 'NOT_FOUND') {
      return res.status(400).json({
        ok: false,
        error: {
          code: 'BAD_REQUEST',
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
    const hotel = await prisma.hotel.create({
      data: {
        name,
        email,
        address,
        phoneNumber,
        destinationId,
        createdById: user.id,
        roomTypes: {
          create: roomTypes.map((r) => ({
            type: r.type,
          })),
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        phoneNumber: true,
        destination: {
          select: {
            id: true,
            name: true,
          },
        },
        roomTypes: {
          select: {
            id: true,
            type: true,
          },
        },
      },
    });

    res.status(201).json({
      ok: true,
      data: {
        hotel,
      },
    });
  } catch (e) {
    req.log.error({ error: e });
    res.status(500).json({
      ok: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong',
      },
    });
  }
});

// get hotel
protectedRouter.get('/api/hotel/:id', async (req, res) => {
  const user = res.locals.user;
  const hotelId = req.params.id;

  try {
    const hotel = await prisma.hotel.findUnique({
      where: { id: hotelId },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        phoneNumber: true,
        destination: {
          select: {
            id: true,
            name: true,
          },
        },
        roomTypes: {
          select: {
            id: true,
            type: true,
          },
        },
      },
    });

    if (!hotel) {
      return res.status(404).json({
        ok: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Hotel does not exists',
        },
      });
    }

    res.status(200).json({
      ok: true,
      data: {
        hotel,
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

// update hotel
protectedRouter.put('/api/hotel/:id', async (req, res) => {
  const user = res.locals.user;
  const hotelId = req.params.id;
  const { name, email, address, destinationId, phoneNumber, roomTypes } =
    req.body;

  if (!isAdmin(user.role.name)) {
    return res.status(403).json({
      ok: false,
      error: {
        code: 'FORBIDDEN',
        message: 'You do not have permission to perform this action',
      },
    });
  }

  const { error } = await findDestinationById(destinationId);

  if (error) {
    if (error.code === 'NOT_FOUND') {
      return res.status(400).json({
        ok: false,
        error: {
          code: 'BAD_REQUEST',
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
    const hotel = await prisma.hotel.findFirst({
      where: {
        id: hotelId,
      },
      select: {
        id: true,
        roomTypes: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!hotel) {
      return res.status(404).json({
        ok: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Hotel not found',
        },
      });
    }

    // roomType which does not have id means new added
    const newAddedRoomTypes = roomTypes
      .filter((r) => typeof r.id === 'undefined')
      .map((r) => ({ type: r.type }));

    // room type which has id
    const roomTypesWithId = roomTypes.filter(
      (r) => typeof r.id !== 'undefined',
    ) as Array<{ id: string; type: string }>;

    const deletedRoomTypes = [] as Array<{ id: string }>;
    const updatedRoomTypes = [] as Array<{ id: string; type: string }>;

    for (const roomType of hotel.roomTypes) {
      const room = roomTypesWithId.find((r) => r.id === roomType.id);

      if (room) updatedRoomTypes.push(room);
      else deletedRoomTypes.push(roomType);
    }

    await prisma.hotel.update({
      where: {
        id: hotel.id,
      },
      data: {
        name,
        email,
        address,
        phoneNumber,
        destinationId,
        createdById: user.id,
        roomTypes: {
          create: newAddedRoomTypes.map((r) => ({
            type: r.type,
          })),
          updateMany: updatedRoomTypes.map((r) => ({
            where: {
              id: r.id,
            },
            data: {
              type: r.type,
            },
          })),
          deleteMany: {
            id: {
              in: deletedRoomTypes.map((r) => r.id),
            },
          },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        phoneNumber: true,
        destination: {
          select: {
            id: true,
            name: true,
          },
        },
        roomTypes: {
          select: {
            id: true,
            type: true,
          },
        },
      },
    });

    res.status(200).json({
      ok: true,
    });
  } catch (e) {
    req.log.error({ error: e });
    res.status(500).json({
      ok: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong',
      },
    });
  }
});

// delete hotel
protectedRouter.delete('/api/hotel/:id', async (req, res) => {
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
    const hotel = await prisma.hotel.findFirst({
      where: {
        id,
      },
      select: {
        id: true,
        deletedAt: true,
      },
    });

    // if hotel has deleted at means its already deleted send 404 because we have soft deleted it
    if (!hotel || hotel?.deletedAt) {
      return res.status(404).json({
        ok: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Hotel not found',
        },
      });
    }

    await prisma.hotel.update({
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
