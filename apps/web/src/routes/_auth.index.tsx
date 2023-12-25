import { FileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = new FileRoute('/_auth/').createRoute({
  component: lazyRouteComponent(() => import("~/modules/_auth/home.module")),
});
