import { FileRoute, lazyRouteComponent } from "@tanstack/react-router";
import { agentsSearchSchema } from "@travel-app/api/schema";
import { AxiosError } from "axios";
import { z } from "zod";
import { ErrorComponent } from "~/components/error-component";
import { api } from "~/utils/api";

const searchSchema = z.object({
  search: agentsSearchSchema.shape.search,
  page: agentsSearchSchema.shape.page,
});

export const Route = new FileRoute('/_auth/agents').createRoute({
  validateSearch: (search) => searchSchema.parse(search),
  loaderDeps: ({ search: { page, search } }) => ({ page, search }),
  loader: async ({
    context: { queryClient },
    deps: { search: searchTerm, page },
  }) => {
    await queryClient.prefetchQuery({
      queryKey: [
        "agents",
        {
          search: searchTerm,
          page,
          perPage: 10,
        },
      ],
      queryFn: () =>
        api.agents({
          queries: { search: searchTerm, page, perPage: 10 },
        }),
    });
  },
  component: lazyRouteComponent(() => import("~/modules/_auth/agents.module")),
  errorComponent: ({ error }) => {
    let message = "There was problem loading agents.";

    if (error instanceof AxiosError && error?.response?.data.error.message) {
      message = error?.response?.data.error.message;
    }

    return <ErrorComponent message={message} />;
  },
});