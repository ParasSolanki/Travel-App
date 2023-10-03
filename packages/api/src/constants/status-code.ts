export const STATUS_CODES = {
  400: {
    code: 'BAD_REQUEST',
  },
  401: {
    code: 'UNAUTHORIZED',
  },
  403: {
    code: 'FORBIDDEN',
  },
  404: {
    code: 'NOT_FOUND',
  },
  405: {
    code: 'METHOD_NOT_SUPPORTED',
  },
  406: {
    code: 'NOT_ACCEPTABLE',
  },
  408: {
    code: 'TIMEOUT',
  },
  409: {
    code: 'CONFLICT',
  },
  422: {
    code: 'UNPROCESSABLE_CONTENT',
  },
  429: {
    code: 'TOO_MANY_REQUESTS',
  },
  500: {
    code: 'INTERNAL_SERVER_ERROR',
  },
} as const;
