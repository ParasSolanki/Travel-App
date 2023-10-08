import { prisma } from '@travel-app/db';
import { protectedRouter } from '../protected-app.js';
import { auth } from '../lib/lucia.js';
import { validateLuciaPasswordHash } from 'lucia/utils';
import { LuciaError } from 'lucia';

// update profile
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

// change password
protectedRouter.patch('/api/me/change/password', async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = res.locals.user;
  const keyId = `email:${res.locals.user.email}`;

  try {
    const key = await prisma.key.findUnique({
      where: {
        id: keyId,
      },
      select: {
        id: true,
        hashed_password: true,
      },
    });

    // if user doesnt have account with email credentials
    if (!key) {
      // create user email key with new password
      await auth.createKey({
        providerId: 'email',
        providerUserId: user.email,
        password: newPassword,
        userId: user.id,
      });
      console.log({ key });
    } else {
      // if user has hashed_password then validate that
      if (key.hashed_password) {
        const validPassword = await validateLuciaPasswordHash(
          oldPassword,
          key.hashed_password,
        );

        if (!validPassword) throw new LuciaError('AUTH_INVALID_PASSWORD');
      }

      // update key password if doesnt have or is valid password
      await auth.updateKeyPassword('email', user.email, newPassword);
    }

    await auth.invalidateAllUserSessions(user.id);

    const session = await auth.createSession({
      userId: user.id,
      attributes: {},
    });

    const sessionCookie = auth.createSessionCookie(session);

    res.setHeader('Set-Cookie', sessionCookie.serialize());

    res.status(200).json({
      ok: true,
    });
  } catch (e) {
    req.log.error({ error: e });
    if (e instanceof LuciaError && e.message === 'AUTH_INVALID_PASSWORD') {
      return res.status(400).json({
        ok: false,
        error: {
          code: 'BAD_REQUEST',
          message: 'Invalid old password',
        },
      });
    }

    res.status(500).json({
      ok: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong',
      },
    });
  }
});
