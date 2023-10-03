import { z } from 'zod';
import { STATUS_CODES } from '../../constants/status-code.js';

const errorSchema = z.object({
  ok: z.literal(false),
});

export const successSchema = z.object({
  ok: z.literal(true),
});

export const internalServerErrorSchema = errorSchema.extend({
  error: z.object({
    code: z.literal(STATUS_CODES[500].code),
    message: z.literal('Something went wrong'),
  }),
});

export const badRequestSchema = errorSchema.extend({
  error: z.object({
    code: z.literal(STATUS_CODES[400].code),
    message: z.string(),
  }),
});

export const unauthorizedSchema = errorSchema.extend({
  error: z.object({
    code: z.literal(STATUS_CODES[401].code),
    message: z.string(),
  }),
});

export const notAcceptableSchema = errorSchema.extend({
  error: z.object({
    code: z.literal(STATUS_CODES[406].code),
    message: z.string(),
  }),
});

export const conflictSchema = errorSchema.extend({
  error: z.object({
    code: z.literal(STATUS_CODES[409].code),
    message: z.string(),
  }),
});

export const forbiddenSchema = errorSchema.extend({
  error: z.object({
    code: z.literal(STATUS_CODES[403].code),
    message: z.string(),
  }),
});

export const notFoundSchema = errorSchema.extend({
  error: z.object({
    code: z.literal(STATUS_CODES[404].code),
    message: z.string(),
  }),
});
