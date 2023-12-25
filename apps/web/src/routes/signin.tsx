import { FileRoute, lazyRouteComponent } from "@tanstack/react-router";
import { signinErrorTypeSchema } from "@travel-app/api/schema";
import { z } from "zod";

const searchSchema = z.object({
  error: signinErrorTypeSchema.optional(),
});

export const Route = new FileRoute('/signin').createRoute({
  validateSearch: (search) => searchSchema.parse(search),
  component: lazyRouteComponent(() => import("~/modules/signin.module")),
});
