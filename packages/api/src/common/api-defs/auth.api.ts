import { makeApi } from '@zodios/core';
import z from 'zod';
import { sessinonUserSchema } from '../schema/user.schema.js';
import {
  badRequestSchema,
  conflictSchema,
  forbiddenSchema,
  internalServerErrorSchema,
  notAcceptableSchema,
  successSchema,
  unauthorizedSchema,
} from '../schema/status-code.schema.js';

export const authApi = makeApi([
  {
    method: 'post',
    path: '/api/auth/signup',
    alias: 'signup',
    description: 'Signup the user',
    parameters: [
      {
        type: 'Body',
        name: 'body',
        schema: z.object({
          email: z.string().email(),
          password: z.string(),
        }),
      },
    ],
    status: 201,
    response: successSchema.extend({
      data: z.object({
        token: z.string(),
        user: sessinonUserSchema,
      }),
    }),
    errors: [
      {
        status: 400,
        schema: badRequestSchema,
      },
      {
        status: 403,
        schema: forbiddenSchema,
      },
      {
        status: 406,
        schema: notAcceptableSchema,
      },
      {
        status: 409,
        schema: conflictSchema,
      },
      {
        status: 'default',
        description: 'Default error',
        schema: internalServerErrorSchema,
      },
    ],
  },
  {
    method: 'post',
    path: '/api/auth/signin',
    alias: 'signin',
    parameters: [
      {
        type: 'Body',
        name: 'body',
        schema: z.object({
          email: z.string().email(),
          password: z.string(),
        }),
      },
    ],
    status: 200,
    description: 'Signin the user',
    response: successSchema.extend({
      data: z.object({
        token: z.string(),
        user: sessinonUserSchema,
      }),
    }),
    errors: [
      {
        status: 400,
        schema: badRequestSchema,
      },
      {
        status: 403,
        schema: forbiddenSchema,
      },
      {
        status: 406,
        schema: notAcceptableSchema,
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
    path: '/api/auth/signout',
    alias: 'signout',
    status: 200,
    response: successSchema,
    description: 'Signout the user',
    errors: [
      {
        status: 400,
        schema: badRequestSchema,
      },
      {
        status: 403,
        schema: forbiddenSchema,
      },
      {
        status: 401,
        schema: unauthorizedSchema,
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
    path: '/api/auth/session',
    alias: 'session',
    status: 200,
    response: successSchema.extend({
      data: z.object({
        user: sessinonUserSchema.optional(),
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
]);
