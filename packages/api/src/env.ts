import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
  clientPrefix: '',
  runtimeEnv: process.env,
  client: {},
  shared: {
    NODE_ENV: z.string(),
  },
  server: {
    PORT: z.string(),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
  },
});
