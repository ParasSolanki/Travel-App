import { FileRoute, lazyRouteComponent } from "@tanstack/react-router";
import { pickupPointsSearchSchema } from "@travel-app/api/schema";
import { AxiosError } from "axios";
import { z } from "zod";
import { destinationQueries } from "~/common/queries";
import { ErrorComponent } from "~/components/error-component";
import { api } from "~/utils/api";

const searchSchema = z.object({
  search: pickupPointsSearchSchema.shape.search,
  page: pickupPointsSearchSchema.shape.page,
});

export const Route = new FileRoute('/_auth/pickup-points').createRoute({
  validateSearch: (search) => searchSchema.parse(search),
  loaderDeps: ({ search: { page, search } }) => ({ page, search }),
  loader: async ({
    context: { queryClient },
    deps: { search: searchTerm, page },
  }) => {
    await Promise.all([
      queryClient.prefetchQuery({
        queryKey: [
          "pickup-points",
          {
            search: searchTerm,
            page,
            perPage: 10,
          },
        ],
        queryFn: () =>
          api.pickupPoints({
            queries: { search: searchTerm, page, perPage: 10 },
          }),
      }),
      queryClient.prefetchQuery(destinationQueries.all),
    ]);
  },
  component: lazyRouteComponent(
    () => import("~/modules/_auth/pickup-points.module"),
  ),
  errorComponent: ({ error }) => {
    let message = "There was problem loading pickup points.";

    if (error instanceof AxiosError && error?.response?.data.error.message) {
      message = error?.response?.data.error.message;
    }

    return <ErrorComponent message={message} />;
  },
});
