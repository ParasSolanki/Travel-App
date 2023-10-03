import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  clientPrefix: "VITE_PUBLIC_",
  runtimeEnv: import.meta.env,
  shared: {
    DEV: z.boolean(),
    PROD: z.boolean(),
    BASE_URL: z.string(),
  },
  client: {
    VITE_PUBLIC_API_URL: z.string().url(),
  },
});
