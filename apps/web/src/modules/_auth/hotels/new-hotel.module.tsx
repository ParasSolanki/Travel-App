import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { createHotelSchema } from "@travel-app/api/schema";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { z } from "zod";
import { Can } from "~/components/can";
import { SectionHeader } from "~/components/section-header";
import { api } from "~/utils/api";
import { HotelForm } from "~/components/hotel/hotel-form";

import {
  Breadcrumb,
  Breadcrumbs,
  BreadcrumbLink,
} from "~/components/ui/breadcrumb";

function NewHotelForm() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["add-hotel"],
    mutationFn: api.createHotel,
    onSuccess() {
      toast.success("Hotel created successfully");
      queryClient.invalidateQueries({
        queryKey: ["hotels"],
      });

      navigate({
        to: "/hotels",
      });
    },
    onError(error) {
      let message = "Something went wrong while creating hotel";

      if (error instanceof AxiosError && error.response?.data.error.message) {
        message = error.response.data.error.message;
      }
      toast.error(message);
    },
  });

  async function onSubmit(values: z.infer<typeof createHotelSchema>) {
    await mutateAsync({
      name: values.name,
      email: values.email,
      address: values.address,
      phoneNumber: values.phoneNumber,
      destinationId: values.destinationId,
      roomTypes: values.roomTypes,
    });
  }

  return (
    <HotelForm
      schema={createHotelSchema}
      isPending={isPending}
      onSubmit={onSubmit}
    />
  );
}

function NewHotelBreadcrumb() {
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
        <BreadcrumbLink isLast>New</BreadcrumbLink>
      </Breadcrumb>
    </Breadcrumbs>
  );
}

export default function NewHotel() {
  return (
    <Can action="create" subject="hotels" redirectTo="/unauthorized">
      <NewHotelBreadcrumb />
      <SectionHeader
        title="New Hotel"
        description="Add new hotel"
        className="mt-4"
      />
      <NewHotelForm />
    </Can>
  );
}
