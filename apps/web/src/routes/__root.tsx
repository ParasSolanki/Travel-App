import type { QueryClient } from "@tanstack/react-query";
import { Outlet, rootRouteWithContext } from "@tanstack/react-router";
import React from "react";
import { env } from "~/env";

// eslint-disable-next-line react-refresh/only-export-components
const TanStackRouterDevtools = env.PROD
  ? () => null // Render nothing in production
  : React.lazy(() =>
      // Lazy load in development
      import("@tanstack/router-devtools").then((res) => ({
        default: res.TanStackRouterDevtools,
        // For Embedded Mode
        // default: res.TanStackRouterDevtoolsPanel
      })),
    );

export const Route = rootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools position="bottom-left" />
    </>
  ),
});
