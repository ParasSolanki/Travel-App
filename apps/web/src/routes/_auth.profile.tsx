import { FileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = new FileRoute('/_auth/profile').createRoute({
  component: lazyRouteComponent(() => import("~/modules/_auth/profile.module")),
});
