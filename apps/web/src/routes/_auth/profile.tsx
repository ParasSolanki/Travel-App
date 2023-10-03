import { FileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const route = new FileRoute("/profile").createRoute({
  component: lazyRouteComponent(() => import("~/modules/_auth/profile.module")),
});
