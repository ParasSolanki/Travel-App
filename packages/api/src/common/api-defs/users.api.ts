import { makeApi } from '@zodios/core';
import {
  forbiddenSchema,
  internalServerErrorSchema,
  successSchema,
  unauthorizedSchema,
} from '../schema/status-code.schema.js';
import {
  usersResponseSchema,
  usersSeachSchema,
} from '../schema/user.schema.js';
import { z } from 'zod';

export const usersApi = makeApi([
  {
    method: 'get',
    path: '/api/users',
    alias: 'users',
    description: 'Get all users',
    parameters: [
      {
        type: 'Query',
        name: 'search',
        schema: usersSeachSchema.shape.search,
      },
      {
        type: 'Query',
        name: 'page',
        schema: usersSeachSchema.shape.page,
      },
      {
        type: 'Query',
        name: 'perPage',
        schema: usersSeachSchema.shape.perPage,
      },
    ],
    status: 200,
    response: successSchema.extend({
      data: z.object({
        users: usersResponseSchema.array(),
        pagination: z.object({
          total: z.number(),
          page: z.number(),
        }),
      }),
    }),
    errors: [
      {
        status: 401,
        schema: unauthorizedSchema,
      },
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
]);
