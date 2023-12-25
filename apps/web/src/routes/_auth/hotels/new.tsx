import { FileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = new FileRoute('/_auth/hotels/new').createRoute({
  component: lazyRouteComponent(
    () => import("~/modules/_auth/hotels/new-hotel.module"),
  ),
});
