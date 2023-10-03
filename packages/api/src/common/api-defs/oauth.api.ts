import { z } from 'zod';
import {
  badRequestSchema,
  internalServerErrorSchema,
} from '../schema/status-code.schema.js';
import { makeApi } from '@zodios/core';

export const oAuthApi = makeApi([
  {
    method: 'get',
    path: '/api/auth/signin/google',
    alias: 'googleSignin',
    status: 302,
    response: z.object({}),
  },
  {
    method: 'get',
    path: '/api/auth/signin/google/callback',
    status: 200,
    parameters: [
      {
        type: 'Query',
        name: 'state',
        schema: z.string(),
      },
      {
        type: 'Query',
        name: 'code',
        schema: z.string(),
      },
    ],
    response: z.object({}),
    errors: [
      {
        status: 400,
        schema: badRequestSchema,
      },
      {
        status: 'default',
        description: 'Default error',
        schema: internalServerErrorSchema,
      },
    ],
  },
]);
