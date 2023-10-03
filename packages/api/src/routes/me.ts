import { prisma } from '@travel-app/db';
import { protectedRouter } from '../protected-app.js';

protectedRouter.put('/api/me', async (req, res) => {
  const user = res.locals.user;

  try {
    const hasUserWithEmail = await prisma.user.findUnique({
      where: {
        email: req.body.email,
        NOT: {
          id: user.id,
        },
      },
      select: {
        id: true,
      },
    });

    if (hasUserWithEmail) {
      return res.status(409).json({
        ok: false,
        error: {
          code: 'CONFLICT',
          message: 'User with email already exists',
        },
      });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: req.body.name,
        address: req.body.address,
        phone: req.body.phone,
        email: req.body.email,
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
