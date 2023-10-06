import { zodiosRouter } from '@zodios/express';
import { auth, googleAuth } from '../lib/lucia.js';
import { parseCookie, serializeCookie } from 'lucia/utils';
import { OAuthRequestError } from '@lucia-auth/oauth';
import { ROLE } from '@travel-app/db/types';
import { prisma } from '@travel-app/db';
import { oAuthApi } from '../common/api-defs/oauth.api.js';
import { getBaseDomain } from '../utils/get-base-domain.js';
import { validateCsrfToken } from '../utils/csrf-token.js';

export const oAuthRouter = zodiosRouter(oAuthApi);

oAuthRouter.post('/api/auth/signin/google', async (req, res) => {
  const { isValid } = validateCsrfToken(req.headers['x-csrf-token']);
  const referer = req.headers.referer;

  if (!isValid || !referer) {
    return res.status(403).json({
      ok: false,
      error: {
        code: 'FORBIDDEN',
        message: 'Forbidden',
      },
    });
  }

  try {
    const [url, state] = await googleAuth.getAuthorizationUrl();
    const stateCookie = serializeCookie('google_oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // `true` for production
      path: '/',
      maxAge: 60 * 60,
    });

    res.setHeader('Set-Cookie', stateCookie);

    res.status(200).json({
      ok: true,
      data: {
        url: url.toString(),
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

oAuthRouter.get('/api/auth/signin/google/callback', async (req, res) => {
  const cookies = parseCookie(req.headers.cookie ?? '');
  const storedState = cookies.google_oauth_state;
  const state = req.query.state;
  const code = req.query.code;
  const referer = req.headers.referer;

  if (!referer) {
    return res.status(400).json({
      ok: false,
      error: {
        code: 'BAD_REQUEST',
        message: 'No referer',
      },
    });
  }

  if (!storedState || storedState !== state) {
    return res.status(400).json({
      ok: false,
      error: {
        code: 'BAD_REQUEST',
        message: 'State is invalid',
      },
    });
  }

  try {
    const { getExistingUser, googleUser, createUser } =
      await googleAuth.validateCallback(code);

    const getUser = async () => {
      const existingUser = await getExistingUser();
      if (existingUser) return existingUser;

      if (!googleUser.email) throw new Error('no email');

      const userRole = await prisma.role.findUnique({
        where: { name: ROLE.USER },
        select: { id: true },
      });

      if (!userRole) throw new Error('User role not found');

      const user = await createUser({
        attributes: {
          name: googleUser.name,
          email: googleUser.email,
          roleId: userRole.id,
        },
      });
      return user;
    };

    const user = await getUser();
    const session = await auth.createSession({
      userId: user.userId,
      attributes: {},
    });
    const authRequest = auth.handleRequest(req, res);
    const sessionCookie = auth.createSessionCookie(session);

    authRequest.setSession(session);

    res.clearCookie('oauth_google_state');

    res.setHeader('Set-Cookie', sessionCookie.serialize());

    return res.status(302).redirect(getBaseDomain(referer));
  } catch (e) {
    req.log.error({ error: e });
    if (e instanceof OAuthRequestError) {
      // invalid code

      return res.sendStatus(400);
    }
    return res.status(500);
  }
});
