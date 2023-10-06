import { makeApi } from '@zodios/core';
import { z } from 'zod';
import {
  badRequestSchema,
  forbiddenSchema,
  internalServerErrorSchema,
  successSchema,
} from '../schema/status-code.schema.js';

export const oAuthApi = makeApi([
  {
    method: 'post',
    path: '/api/auth/signin/google',
    alias: 'googleSignin',
    status: 200,
    response: successSchema.extend({
      data: z.object({
        url: z.string(),
      }),
    }),
    errors: [
      {
        status: 403,
        schema: forbiddenSchema,
      },
      {
        status: 'default',
        description: 'Default error',
        schema: internalServerErrorSchema,
      },
    ],
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
