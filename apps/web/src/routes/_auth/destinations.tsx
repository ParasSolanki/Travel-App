import { destinationsSearchSchema } from "@travel-app/api/schema";
import { FileRoute, lazyRouteComponent } from "@tanstack/react-router";
import { z } from "zod";
import { api } from "~/utils/api";
import { AxiosError } from "axios";
import { ErrorComponent } from "~/components/error-component";

const searchSchema = z.object({
  search: destinationsSearchSchema.shape.search,
  page: destinationsSearchSchema.shape.page,
});

export const route = new FileRoute("/destinations").createRoute({
  validateSearch: (search) => searchSchema.parse(search),
  loader: async ({
    context: { queryClient },
    search: { search: searchTerm, page },
  }) => {
    await queryClient.prefetchQuery({
      queryKey: [
        "destinations",
        {
          search: searchTerm,
          page,
          perPage: 10,
        },
      ],
      queryFn: () =>
        api.destinations({
          queries: { search: searchTerm, page, perPage: 10 },
        }),
    });
  },
  component: lazyRouteComponent(
    () => import("~/modules/_auth/destinations.module"),
  ),
  errorComponent: ({ error }) => {
    let message = "There was problem loading destinations.";

    if (error instanceof AxiosError && error?.response?.data.error.message) {
      message = error?.response?.data.error.message;
    }

    return <ErrorComponent message={message} />;
  },
});
