import { zodiosRouter } from '@zodios/express';
import { auth, googleAuth } from '../lib/lucia.js';
import { parseCookie, serializeCookie } from 'lucia/utils';
import { OAuthRequestError } from '@lucia-auth/oauth';
import { ROLE } from '@travel-app/db/types';
import { prisma } from '@travel-app/db';
import { oAuthApi } from '../common/api-defs/oauth.api.js';

export const oAuthRouter = zodiosRouter(oAuthApi);

oAuthRouter.get('/api/auth/signin/google', async (req, res) => {
  const [url, state] = await googleAuth.getAuthorizationUrl();
  const stateCookie = serializeCookie('google_oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // `true` for production
    path: '/',
    maxAge: 60 * 60,
  });

  res.setHeader('Set-Cookie', stateCookie);
  res.setHeader('Location', url.toString());
  return res.redirect(302, url.toString());
});

oAuthRouter.get('/api/auth/signin/google/callback', async (req, res) => {
  const cookies = parseCookie(req.headers.cookie ?? '');
  const storedState = cookies.google_oauth_state;
  const state = req.query.state;
  const code = req.query.code;

  // TODO: validate base domain and redirect to that domain

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

    res.setHeader('Set-Cookie', sessionCookie.serialize());

    return res.status(302).redirect("http://localhost:5173");
  } catch (e) {
    // console.log({ e });
    if (e instanceof OAuthRequestError) {
      // invalid code

      return res.sendStatus(400);
    }
    return res.status(500);
  }
});
