import { FileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = new FileRoute('/signup').createRoute({
  component: lazyRouteComponent(() => import("~/modules/signup.module")),
});
