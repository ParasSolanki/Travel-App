import { defineConfig, loadEnv } from "vite";
import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import z from "zod";

const envSchema = z.object({
  VITE_PUBLIC_API_URL: z.string().url(),
});

// https://vitejs.dev/config/
const config = (params) => {
  const env = loadEnv(
    params.mode,
    path.join(fileURLToPath(new URL(import.meta.url)), ".."),
  );

  const result = envSchema.safeParse(env);

  if (!result.success) throw new Error("Environmental variables are incorrect");
  const parsedEnv = result.data;

  return defineConfig({
    plugins: [react()],
    resolve: {
      alias: {
        "~": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    server: {
      proxy: {
        "/api": {
          target: parsedEnv.VITE_PUBLIC_API_URL,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  });
};

export default config;
