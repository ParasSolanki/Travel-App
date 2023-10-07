import { FileRoute, lazyRouteComponent } from "@tanstack/react-router";
import { AxiosError } from "axios";
import { ErrorComponent } from "~/components/error-component";
import { api } from "~/utils/api";

export const route = new FileRoute("/hotels/$hotelId/edit").createRoute({
  loader: async ({ context: { queryClient }, params: { hotelId } }) => {
    await queryClient.ensureQueryData({
      queryKey: ["hotels", hotelId],
      queryFn: () =>
        api.getHotel({
          params: { id: hotelId },
        }),
    });
  },
  component: lazyRouteComponent(
    () => import("~/modules/_auth/hotels/$hotelId.edit.module"),
  ),
  errorComponent: ({ error }) => {
    let message = "There was problem loading hotel.";

    if (error instanceof AxiosError && error?.response?.data.error.message) {
      message = error?.response?.data.error.message;
    }

    return <ErrorComponent message={message} />;
  },
});
