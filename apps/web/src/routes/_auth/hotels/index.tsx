import { FileRoute, lazyRouteComponent } from "@tanstack/react-router";
import { hotelsSearchSchema } from "@travel-app/api/schema";
import { AxiosError } from "axios";
import { z } from "zod";
import { ErrorComponent } from "~/components/error-component";
import { api } from "~/utils/api";

const searchSchema = z.object({
  search: hotelsSearchSchema.shape.search,
  page: hotelsSearchSchema.shape.page,
});

export const route = new FileRoute("/hotels").createRoute({
  validateSearch: (search) => searchSchema.parse(search),
  loader: async ({
    context: { queryClient },
    search: { search: searchTerm, page },
  }) => {
    await queryClient.prefetchQuery({
      queryKey: [
        "hotels",
        {
          search: searchTerm,
          page,
          perPage: 10,
        },
      ],
      queryFn: () =>
        api.hotels({
          queries: { search: searchTerm, page, perPage: 10 },
        }),
    });
  },
  component: lazyRouteComponent(
    () => import("~/modules/_auth/hotels/hotels.module"),
  ),
  errorComponent: ({ error }) => {
    let message = "There was problem loading hotels.";

    if (error instanceof AxiosError && error?.response?.data.error.message) {
      message = error?.response?.data.error.message;
    }

    return <ErrorComponent message={message} />;
  },
});
