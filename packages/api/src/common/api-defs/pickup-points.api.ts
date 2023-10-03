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
  pickupPointId,
  pickupPointName,
  createPickupPointSchema,
  editPickupPointSchema,
  pickupPointsResponseSchema,
  pickupPointsSearchSchema,
} from '../schema/pickup-points.schema.js';
import {
  destinationId,
  destinationName,
} from '../schema/destination.schema.js';

export const pickupPointsApi = makeApi([
  {
    method: 'get',
    path: '/api/pickup-points',
    alias: 'pickupPoints',
    parameters: [
      {
        type: 'Query',
        name: 'search',
        schema: pickupPointsSearchSchema.shape.search,
      },
      {
        type: 'Query',
        name: 'page',
        schema: pickupPointsSearchSchema.shape.page,
      },
      {
        type: 'Query',
        name: 'perPage',
        schema: pickupPointsSearchSchema.shape.perPage,
      },
    ],
    status: 200,
    response: successSchema.extend({
      data: z.object({
        pickupPoints: pickupPointsResponseSchema.array(),
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
    path: '/api/pickup-points/all',
    alias: 'allPickupPoints',
    status: 200,
    response: successSchema.extend({
      data: z.object({
        pickupPoints: pickupPointsResponseSchema.array(),
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
    path: '/api/pickup-points',
    alias: 'createPickupPoint',
    parameters: [
      {
        type: 'Body',
        name: 'body',
        schema: createPickupPointSchema,
      },
    ],
    status: 201,
    response: successSchema.extend({
      data: z.object({
        pickupPoint: z.object({
          id: pickupPointId,
          name: pickupPointName,
          destination: z.object({
            id: destinationId,
            name: destinationName,
          }),
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
    path: '/api/pickup-point/:id',
    alias: 'updatePickupPoint',
    parameters: [
      {
        type: 'Path',
        name: 'id',
        schema: pickupPointId,
      },
      {
        type: 'Body',
        name: 'body',
        schema: editPickupPointSchema,
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
    path: '/api/pickup-point/:id',
    alias: 'deletePickupPoint',
    parameters: [
      {
        type: 'Path',
        name: 'id',
        schema: pickupPointId,
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
