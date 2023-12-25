import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, RouteApi, useNavigate } from "@tanstack/react-router";
import { editHotelSchema } from "@travel-app/api/schema";
import { AxiosError } from "axios";
import {
  Breadcrumb,
  Breadcrumbs,
  BreadcrumbLink,
} from "~/components/ui/breadcrumb";
import toast from "react-hot-toast";
import { Can } from "~/components/can";
import { HotelForm } from "~/components/hotel/hotel-form";
import { SectionHeader } from "~/components/section-header";
import { api } from "~/utils/api";
import { z } from "zod";

const editHotelRoute = new RouteApi({ id: "/_auth/hotels/$hotelId/edit" });

function EditHotelBreadcrumb() {
  return (
    <Breadcrumbs>
      <Breadcrumb>
        <BreadcrumbLink>
          <Link to="/hotels" search={{ page: 0, search: undefined }}>
            Hotels
          </Link>
        </BreadcrumbLink>
      </Breadcrumb>
      <Breadcrumb>
        <BreadcrumbLink isLast>Edit</BreadcrumbLink>
      </Breadcrumb>
    </Breadcrumbs>
  );
}

function EditHotelForm() {
  const params = editHotelRoute.useParams({
    select: ({ hotelId }) => ({ hotelId }),
  });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data, error } = useQuery({
    queryKey: ["hotels", params.hotelId],
    queryFn: () => api.getHotel({ params: { id: params.hotelId } }),
  });
  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["update-hotel", params.hotelId],
    mutationFn: (data: z.infer<typeof editHotelSchema>) =>
      api.updateHotel(data, { params: { id: params.hotelId } }),
    onSuccess() {
      toast.success("Hotel edited successfully");
      queryClient.invalidateQueries({
        queryKey: ["hotels"],
      });

      navigate({
        to: "/hotels",
        search: {
          page: 0,
        },
      });
    },
    onError(error) {
      let message = "Something went wrong while editing hotel";

      if (error instanceof AxiosError && error.response?.data.error.message) {
        message = error.response.data.error.message;
      }
      toast.error(message);
    },
  });

  async function onSubmit(values: z.infer<typeof editHotelSchema>) {
    await mutateAsync({
      name: values.name,
      email: values.email,
      address: values.address,
      phoneNumber: values.phoneNumber,
      destinationId: values.destinationId,
      roomTypes: values.roomTypes,
    });
  }

  if (!data || error) {
    return "Something went wrong";
  }

  return (
    <HotelForm
      schema={editHotelSchema}
      hotel={data.data.hotel}
      isPending={isPending}
      onSubmit={onSubmit}
    />
  );
}

export default function EditHotel() {
  return (
    <Can action="update" subject="hotels" redirectTo="/unauthorized">
      <EditHotelBreadcrumb />
      <SectionHeader
        title="Edit Hotel"
        description="Edit hotel data"
        className="mt-4"
      />
      <EditHotelForm />
    </Can>
  );
}
