import { LuciaError } from 'lucia';
import { zodiosRouter } from '@zodios/express';
import { Prisma, ROLE } from '@travel-app/db/types';
import { prisma } from '@travel-app/db';
import { auth } from '../lib/lucia.js';
import { authApi } from '../common/api-defs/auth.api.js';
import { getSessionUserData } from '../common/services/user.service.js';

export const authRouter = zodiosRouter(authApi);

// signup
authRouter.post('/api/auth/signup', async (req, res) => {
  const authRequest = auth.handleRequest(req, res);

  try {
    const session = await authRequest.validate();

    if (session) {
      return res.status(406).json({
        ok: false,
        error: {
          code: 'NOT_ACCEPTABLE',
          message: 'Already Logged In',
        },
      });
    }
  } catch (e) {
    req.log.error({ error: e });
    return res.status(500).json({
      ok: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong',
      },
    });
  }

  const { email, password } = req.body;

  try {
    const userRole = await prisma.role.findUnique({
      where: { name: ROLE.USER },
      select: { id: true },
    });

    if (!userRole) throw new Error('User role not found');

    const user = await auth.createUser({
      key: {
        providerId: 'email',
        providerUserId: email,
        password,
      },
      attributes: {
        email,
        roleId: userRole.id,
      },
    });

    const userData = await getSessionUserData(user.userId);

    const session = await auth.createSession({
      userId: user.userId,
      attributes: {},
    });

    authRequest.setSession(session);

    res.status(201).json({
      ok: true,
      data: {
        token: session.sessionId,
        user: userData,
      },
    });
  } catch (e) {
    req.log.error({ error: e });
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2002') {
        return res.status(409).json({
          ok: false,
          error: {
            code: 'CONFLICT',
            message: 'User with this email already exists',
          },
        });
      }
    }

    if (e instanceof LuciaError) {
      if (e.message === 'AUTH_DUPLICATE_KEY_ID') {
        return res.status(409).json({
          ok: false,
          error: {
            code: 'CONFLICT',
            message: 'User with this email already exists',
          },
        });
      }
      if (
        e.message === 'AUTH_INVALID_KEY_ID' ||
        e.message === 'AUTH_INVALID_PASSWORD'
      ) {
        return res.status(400).json({
          ok: false,
          error: {
            code: 'BAD_REQUEST',
            message: 'Incorrect username or password',
          },
        });
      }
    }

    return res.status(500).json({
      ok: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong',
      },
    });
  }
});

// signin
authRouter.post('/api/auth/signin', async (req, res) => {
  const authRequest = auth.handleRequest(req, res);

  try {
    // redirect to profile page if authenticated
    const session = await authRequest.validate();

    if (session) {
      return res.status(406).json({
        ok: false,
        error: {
          code: 'NOT_ACCEPTABLE',
          message: 'Already Logged In',
        },
      });
    }
  } catch (e) {
    req.log.error({ error: e });
    res.status(500).json({
      ok: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong',
      },
    });
    return;
  }

  const { email, password } = req.body;

  try {
    const key = await auth.useKey('email', email, password);

    const userData = await getSessionUserData(key.userId);

    const session = await auth.createSession({
      userId: key.userId,
      attributes: {},
    });

    authRequest.setSession(session);
    const sessionCookie = auth.createSessionCookie(session);

    res.setHeader('Set-Cookie', sessionCookie.serialize());

    res.status(200).json({
      ok: true,
      data: {
        token: session.sessionId,
        user: userData,
      },
    });
  } catch (e) {
    req.log.error({ error: e });
    if (e instanceof LuciaError) {
      if (e.message === 'AUTH_INVALID_PASSWORD') {
        return res.status(400).json({
          ok: false,
          error: {
            code: 'BAD_REQUEST',
            message: 'Invalid Credentials',
          },
        });
      }
    }

    if (
      e instanceof LuciaError &&
      (e.message === 'AUTH_INVALID_KEY_ID' ||
        e.message === 'AUTH_INVALID_PASSWORD')
    ) {
      return res.status(400).json({
        ok: false,
        error: {
          code: 'BAD_REQUEST',
          message: 'Incorrect username or password',
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

// signout
authRouter.get('/api/auth/signout', async (req, res) => {
  const authRequest = auth.handleRequest(req, res);

  try {
    const session = await authRequest.validate();

    // error not authenticated
    if (!session) {
      return res.status(401).json({
        ok: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Not Logged In',
        },
      });
    }

    await auth.invalidateSession(session.sessionId); // invalidate current session
    authRequest.setSession(null); // clear session cookie

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

// session
authRouter.get('/api/auth/session', async (req, res) => {
  const authRequest = auth.handleRequest(req, res);

  try {
    const session = await authRequest.validate();

    let user = undefined;

    if (session) {
      user = await getSessionUserData(session.user.userId);
    }

    res.status(200).json({
      ok: true,
      data: {
        user,
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
