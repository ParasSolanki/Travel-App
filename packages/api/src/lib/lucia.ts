import { lucia } from 'lucia';
import { express } from 'lucia/middleware';
import { prisma } from '@lucia-auth/adapter-prisma';
import { google } from '@lucia-auth/oauth/providers';
import { prisma as prismaClient } from './prisma.js';
import { env } from '../env.js';
import 'lucia/polyfill/node';

export const auth = lucia({
  env: env.NODE_ENV === 'production' ? 'PROD' : 'DEV',
  middleware: express(),
  adapter: prisma(prismaClient, {
    user: 'user', // model User {}
    key: 'key', // model Key {}
    session: 'session', // model Session {}
  }),
  csrfProtection: {
    host: new URL(env.WEB_URL).host,
  },
  sessionCookie: {
    name: '_tra', // _travelapp
  },
  // session will be vaid for 2 DAY -> 1 DAY active and other day idle it will get activated if session is idle
  sessionExpiresIn: {
    activePeriod: 1000 * 60 * 60 * 24, // 1 DAY
    idlePeriod: 1000 * 60 * 60 * 24, // 1 DAY
  },
  getUserAttributes(databaseUser) {
    return {
      email: databaseUser.email,
    };
  },
});

export const googleAuth = google(auth, {
  clientId: env.GOOGLE_CLIENT_ID,
  clientSecret: env.GOOGLE_CLIENT_SECRET,
  redirectUri: 'http://localhost:3001/api/auth/signin/google/callback',
  scope: ['https://www.googleapis.com/auth/userinfo.email'],
});

export type Auth = typeof auth;
