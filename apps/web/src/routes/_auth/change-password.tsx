import { FileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const route = new FileRoute("/_auth/change-password").createRoute({
  component: lazyRouteComponent(
    () => import("~/modules/_auth/change-password.module"),
  ),
});
