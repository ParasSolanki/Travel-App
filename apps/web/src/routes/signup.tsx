import { FileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const route = new FileRoute("/signup").createRoute({
  component: lazyRouteComponent(() => import("~/modules/signup.module")),
});
