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
  createHotelSchema,
  editHotelSchema,
  hotelId,
  hotelsResponseSchema,
  hotelsSearchSchema,
} from '../schema/hotels.schema.js';

export const hotelsApi = makeApi([
  {
    method: 'get',
    path: '/api/hotels',
    alias: 'hotels',
    parameters: [
      {
        type: 'Query',
        name: 'search',
        schema: hotelsSearchSchema.shape.search,
      },
      {
        type: 'Query',
        name: 'page',
        schema: hotelsSearchSchema.shape.page,
      },
      {
        type: 'Query',
        name: 'perPage',
        schema: hotelsSearchSchema.shape.perPage,
      },
    ],
    status: 200,
    response: successSchema.extend({
      data: z.object({
        hotels: hotelsResponseSchema.array(),
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
    method: 'post',
    path: '/api/hotels',
    alias: 'createHotel',
    parameters: [
      {
        type: 'Body',
        name: 'body',
        schema: createHotelSchema,
      },
    ],
    status: 201,
    response: successSchema.extend({
      data: z.object({
        hotel: hotelsResponseSchema,
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
    method: 'get',
    path: '/api/hotel/:id',
    alias: 'getHotel',
    status: 200,
    parameters: [
      {
        type: 'Path',
        name: 'id',
        schema: hotelId,
      },
    ],
    response: successSchema.extend({
      data: z.object({
        hotel: hotelsResponseSchema,
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
  {
    method: 'put',
    path: '/api/hotel/:id',
    alias: 'updateHotel',
    parameters: [
      {
        type: 'Path',
        name: 'id',
        schema: hotelId,
      },
      {
        type: 'Body',
        name: 'body',
        schema: editHotelSchema,
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
        status: 404,
        schema: notFoundSchema,
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
    path: '/api/hotel/:id',
    alias: 'deleteHotel',
    parameters: [
      {
        type: 'Path',
        name: 'id',
        schema: hotelId,
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
