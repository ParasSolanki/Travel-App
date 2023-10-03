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
  agent,
  agentId,
  agentsResponseSchema,
  agentsSearchSchema,
  createAgentSchema,
  editAgentSchema,
} from '../schema/agents.schema.js';

export const agentsApi = makeApi([
  {
    method: 'get',
    path: '/api/agents',
    alias: 'agents',
    parameters: [
      {
        type: 'Query',
        name: 'search',
        schema: agentsSearchSchema.shape.search,
      },
      {
        type: 'Query',
        name: 'page',
        schema: agentsSearchSchema.shape.page,
      },
      {
        type: 'Query',
        name: 'perPage',
        schema: agentsSearchSchema.shape.perPage,
      },
    ],
    status: 200,
    response: successSchema.extend({
      data: z.object({
        agents: agentsResponseSchema.array(),
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
    path: '/api/agents/all',
    alias: 'allAgents',
    status: 200,
    response: successSchema.extend({
      data: z.object({
        agents: agentsResponseSchema.array(),
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
    path: '/api/agents',
    alias: 'createAgent',
    parameters: [
      {
        type: 'Body',
        name: 'body',
        schema: createAgentSchema,
      },
    ],
    status: 201,
    response: successSchema.extend({
      data: z.object({
        agent: agent,
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
    path: '/api/agent/:id',
    alias: 'updateAgent',
    parameters: [
      {
        type: 'Path',
        name: 'id',
        schema: agentId,
      },
      {
        type: 'Body',
        name: 'body',
        schema: editAgentSchema,
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
    path: '/api/agent/:id',
    alias: 'deleteAgent',
    parameters: [
      {
        type: 'Path',
        name: 'id',
        schema: agentId,
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
