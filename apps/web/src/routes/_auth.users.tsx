import { FileRoute, lazyRouteComponent } from "@tanstack/react-router";
import { z } from "zod";
import { usersSeachSchema } from "@travel-app/api/schema";
import { AxiosError } from "axios";
import { ErrorComponent } from "~/components/error-component";
import { userQueries } from "~/common/queries";

const searchSchema = z.object({
  search: usersSeachSchema.shape.search,
  page: usersSeachSchema.shape.page,
});

export const Route = new FileRoute('/_auth/users').createRoute({
  validateSearch: (search) => searchSchema.parse(search),
  loaderDeps: ({ search: { page, search } }) => ({ page, search }),
  loader: async ({ context: { queryClient }, deps: { page, search } }) => {
    await queryClient.ensureQueryData(
      userQueries.list({ search, page, perPage: 10 }),
    );
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
