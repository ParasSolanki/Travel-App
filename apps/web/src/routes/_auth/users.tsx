import { FileRoute, lazyRouteComponent } from "@tanstack/react-router";
import { z } from "zod";
import { usersSeachSchema } from "@travel-app/api/schema";
import { api } from "~/utils/api";
import { AxiosError } from "axios";
import { ErrorComponent } from "~/components/error-component";

const searchSchema = z.object({
  search: usersSeachSchema.shape.search,
  page: usersSeachSchema.shape.page,
});

export const route = new FileRoute("/users").createRoute({
  validateSearch: (search) => searchSchema.parse(search),
  loader: async ({ context: { queryClient }, search: { page, search } }) => {
    await queryClient.prefetchQuery({
      queryKey: ["users", { search, page, perPage: 10 }],
      queryFn: () => api.users({ queries: { search, page, perPage: 10 } }),
    });
  },
  component: lazyRouteComponent(() => import("~/modules/_auth/users.module")),
  errorComponent: ({ error }) => {
    let message = "There was problem loading users.";

    if (error instanceof AxiosError && error?.response?.data.error.message) {
      message = error?.response?.data.error.message;
    }

    return <ErrorComponent message={message} />;
  },
});
