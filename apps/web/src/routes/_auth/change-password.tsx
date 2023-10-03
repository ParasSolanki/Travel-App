import { FileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const route = new FileRoute("/change-password").createRoute({
  component: lazyRouteComponent(
    () => import("~/modules/_auth/change-password"),
  ),
});
