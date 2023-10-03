import { FileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const route = new FileRoute("/signin").createRoute({
  component: lazyRouteComponent(() => import("~/modules/signin.module")),
});
