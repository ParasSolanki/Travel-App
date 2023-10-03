import { makeApi } from '@zodios/core';
import { z } from 'zod';
import {
  badRequestSchema,
  conflictSchema,
  forbiddenSchema,
  internalServerErrorSchema,
  notFoundSchema,
  successSchema,
  unauthorizedSchema,
} from '../schema/status-code.schema.js';
import {
  destinationId,
  destinationName,
  shortCode,
  createDestinationSchema,
  editDestinationSchema,
  destinationsResponseSchema,
  destinationsSearchSchema,
} from '../schema/destination.schema.js';

export const destinationsApi = makeApi([
  {
    method: 'get',
    path: '/api/destinations',
    alias: 'destinations',
    parameters: [
      {
        type: 'Query',
        name: 'search',
        schema: destinationsSearchSchema.shape.search,
      },
      {
        type: 'Query',
        name: 'page',
        schema: destinationsSearchSchema.shape.page,
      },
      {
        type: 'Query',
        name: 'perPage',
        schema: destinationsSearchSchema.shape.perPage,
      },
    ],
    status: 200,
    response: successSchema.extend({
      data: z.object({
        destinations: destinationsResponseSchema.array(),
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
  {
    method: 'get',
    path: '/api/destinations/all',
    alias: 'allDestinations',
    status: 200,
    response: successSchema.extend({
      data: z.object({
        destinations: destinationsResponseSchema.array(),
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
  {
    method: 'post',
    path: '/api/destinations',
    alias: 'createDestination',
    parameters: [
      {
        type: 'Body',
        name: 'body',
        schema: createDestinationSchema,
      },
    ],
    status: 201,
    response: successSchema.extend({
      data: z.object({
        destination: z.object({
          id: destinationId,
          name: destinationName,
          shortCode,
        }),
      }),
    }),
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
    method: 'put',
    path: '/api/destination/:id',
    alias: 'updateDestination',
    parameters: [
      {
        type: 'Path',
        name: 'id',
        schema: destinationId,
      },
      {
        type: 'Body',
        name: 'body',
        schema: editDestinationSchema,
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
    method: 'delete',
    path: '/api/destination/:id',
    alias: 'deleteDestination',
    parameters: [
      {
        type: 'Path',
        name: 'id',
        schema: destinationId,
      },
    ],
    status: 200,
    response: successSchema,
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
        status: 404,
        schema: notFoundSchema,
      },
      {
        status: 'default',
        description: 'Default error',
        schema: internalServerErrorSchema,
      },
    ],
  },
]);
