import { Outlet, RouterContext } from "@tanstack/react-router";
import { queryClient } from "~/lib/tanstack-query/query-client";

const routerContext = new RouterContext<{ queryClient: typeof queryClient }>();

export const route = routerContext.createRootRoute({
  component: () => <Outlet />,
});
