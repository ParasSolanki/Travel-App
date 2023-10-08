import { prisma } from '@travel-app/db';
import { ROLE } from '@travel-app/db/types';
import { zodiosRouter } from '@zodios/express';
import { parseCookie, serializeCookie } from 'lucia/utils';
import { oAuthApi } from '../common/api-defs/oauth.api.js';
import { signinErrorTypes } from '../common/schema/auth.schema.js';
import { env } from '../env.js';
import { auth, googleAuth } from '../lib/lucia.js';
import { validateCsrfToken } from '../utils/csrf-token.js';
import { getBaseDomain } from '../utils/get-base-domain.js';

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
      secure: env.NODE_ENV === 'production', // `true` for production
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
  const webDoamin = getBaseDomain(env.WEB_URL);

  if (!storedState || storedState !== state) {
    return res
      .status(302)
      .redirect(`${webDoamin}/signin?error=${signinErrorTypes.OAUTH_CALLBACK}`);
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

    res.status(302).redirect(webDoamin);
  } catch (e) {
    req.log.error({ error: e });
    res
      .status(302)
      .redirect(`${webDoamin}/signin?error=${signinErrorTypes.OAUTH_CALLBACK}`);
  }
});
