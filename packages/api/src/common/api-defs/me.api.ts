import { makeApi } from '@zodios/core';
import {
  badRequestSchema,
  conflictSchema,
  forbiddenSchema,
  internalServerErrorSchema,
  successSchema,
  unauthorizedSchema,
} from '../schema/status-code.schema.js';
import {
  changePasswordSchema,
  updateProfileSchema,
} from '../schema/user.schema.js';

export const meApi = makeApi([
  {
    method: 'put',
    path: '/api/me',
    alias: 'updateProfile',
    parameters: [
      {
        type: 'Body',
        name: 'body',
        schema: updateProfileSchema,
      },
    ],
    status: 200,
    response: successSchema,
    errors: [
      {
        status: 400,
        schema: badRequestSchema,
      },
      {
        status: 401,
        schema: unauthorizedSchema,
      },
      {
        status: 403,
        schema: forbiddenSchema,
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
    method: 'patch',
    path: '/api/me/change/password',
    alias: 'changePassword',
    parameters: [
      {
        type: 'Body',
        name: 'body',
        schema: changePasswordSchema,
      },
    ],
    status: 200,
    response: successSchema,
    errors: [
      {
        status: 400,
        schema: badRequestSchema,
      },
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
