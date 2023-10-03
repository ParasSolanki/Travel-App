import { FileRoute, lazyRouteComponent } from "@tanstack/react-router";
import { pickupPointsSearchSchema } from "@travel-app/api/schema";
import { AxiosError } from "axios";
import { z } from "zod";
import { ErrorComponent } from "~/components/error-component";
import { api } from "~/utils/api";

const searchSchema = z.object({
  search: pickupPointsSearchSchema.shape.search,
  page: pickupPointsSearchSchema.shape.page,
});

export const route = new FileRoute("/pickup-points").createRoute({
  validateSearch: (search) => searchSchema.parse(search),
  loader: async ({
    context: { queryClient },
    search: { search: searchTerm, page },
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
      queryClient.prefetchQuery({
        queryKey: ["destinations", "all"],
        queryFn: () => api.allDestinations(),
      }),
    ]);
  },
  component: lazyRouteComponent(() => import("~/modules/_auth/pickup-points")),
  errorComponent: ({ error }) => {
    let message = "There was problem loading pickup points.";

    if (error instanceof AxiosError && error?.response?.data.error.message) {
      message = error?.response?.data.error.message;
    }

    return <ErrorComponent message={message} />;
  },
});
