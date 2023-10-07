import { FileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const route = new FileRoute("/").createRoute({
  component: lazyRouteComponent(() => import("~/modules/_auth/home.module")),
});
