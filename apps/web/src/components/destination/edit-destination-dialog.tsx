import { useMutation } from "@tanstack/react-query";
import { editDestinationSchema } from "@travel-app/api/schema";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { z } from "zod";
import { Destination } from "~/types";
import { api } from "~/utils/api";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import { DestinationForm } from "./destination-form";

export default function EditDestinationDialog({
  open,
  destination,
  onOpenChange,
  onSuccess,
}: {
  open: boolean;
  destination: Destination;
  onOpenChange: (v: boolean) => void;
  onSuccess?: () => void;
}) {
  const { mutateAsync, isLoading } = useMutation({
    mutationKey: ["update-destination", destination.id],
    mutationFn: (values: z.infer<typeof editDestinationSchema>) =>
      api.updateDestination(values, { params: { id: destination.id } }),
    onSuccess() {
      toast.success("Destination updated successfully");
      onOpenChange(false);
      onSuccess?.();
    },
    onError(error) {
      let message = "Something went wrong while updating destination";

      if (error instanceof AxiosError && error.response?.data.error.message) {
        message = error.response.data.error.message;
      }
      toast.error(message);
    },
  });

  async function onSubmit(values: z.infer<typeof editDestinationSchema>) {
    await mutateAsync({
      name: values.name,
      shortCode: values.shortCode,
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <h6 className="font-cal-sans text-2xl font-semibold">
            Edit Destination
          </h6>
        </DialogHeader>
        <DestinationForm
          schema={editDestinationSchema}
          destination={destination}
          isLoading={isLoading}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
