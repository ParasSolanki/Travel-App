import { z } from "zod";
import { email, password } from "@travel-app/api/schema";

export const signinSchema = z.object({
  email,
  password,
});

export const signupSchema = z.object({
  email,
  password,
});
