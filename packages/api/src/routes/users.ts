import { prisma } from '@travel-app/db';
import { protectedRouter } from '../protected-app.js';
import { isAdmin } from '../utils/is-admin.js';

protectedRouter.get('/api/users', async (req, res) => {
  const user = res.locals.user;
  const { search, page, perPage } = req.query;

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
    const where = {
      AND: [
        {
          role: {
            name: { equals: 'USER' },
          },
        },
        {
          OR: [
            { name: { contains: search } },
            { email: { contains: search } },
            { address: { contains: search } },
            { phone: { contains: search } },
          ],
        },
      ],
    };

    const [total, users] = await prisma.$transaction([
      prisma.user.count({
        where,
      }),
      prisma.user.findMany({
        where,
        take: perPage,
        skip: page > 0 ? perPage * page : 0,
        select: {
          id: true,
          name: true,
          email: true,
          address: true,
          phone: true,
        },
      }),
    ]);

    res.status(200).json({
      ok: true,
      data: {
        users,
        pagination: {
          total,
          page: Math.ceil(total / perPage),
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
