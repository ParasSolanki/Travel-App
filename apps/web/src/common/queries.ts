import { queryOptions } from "@tanstack/react-query";
import {
  destinationsSearchSchema,
  usersSeachSchema,
} from "@travel-app/api/schema";
import { z } from "zod";
import { api } from "~/utils/api";

export const userKeys = {
  list: (queries: z.infer<typeof usersSeachSchema>) =>
    ["users", "list", queries] as const,
};

export const userQueries = {
  list: (queries: z.infer<typeof usersSeachSchema>) =>
    queryOptions({
      queryKey: userKeys.list(queries),
      queryFn: () =>
        api.users({
          queries,
        }),
    }),
};

export const destinationKeys = {
  all: ["destinations"] as const,
  list: (queries: z.infer<typeof destinationsSearchSchema>) =>
    [...destinationKeys.all, "list", queries] as const,
};

export const destinationQueries = {
  all: queryOptions({
    queryKey: destinationKeys.all,
    queryFn: api.allDestinations,
  }),
  list: (queries: z.infer<typeof destinationsSearchSchema>) =>
    queryOptions({
      queryKey: destinationKeys.list(queries),
      queryFn: () =>
        api.destinations({
          queries,
        }),
    }),
};

export const sessionKeys = {
  get: ["session"] as const,
};

export const sessionQueires = {
  get: () =>
    queryOptions({
      queryKey: sessionKeys.get,
      queryFn: api.session,
    }),
};
