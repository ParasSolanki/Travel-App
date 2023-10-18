import { useMutation } from "@tanstack/react-query";
import { editPickupPointSchema } from "@travel-app/api/schema";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader } from "~/components/ui/dialog";
import { PickupPointColumn } from "~/types";
import { api } from "~/utils/api";
import { PickupPointForm } from "./pickup-point-form";

export default function EditPickupPointDialog({
  open,
  pickupPoint,
  onOpenChange,
  onSuccess,
}: {
  open: boolean;
  pickupPoint: PickupPointColumn;
  onOpenChange: (v: boolean) => void;
  onSuccess?: () => void;
}) {
  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["update-pickup-point", pickupPoint.id],
    mutationFn: (values: z.infer<typeof editPickupPointSchema>) =>
      api.updatePickupPoint(values, { params: { id: pickupPoint.id } }),
    onSuccess() {
      toast.success("Pickup point updated successfully");
      onOpenChange(false);
      onSuccess?.();
    },
    onError(error) {
      let message = "Something went wrong while updating pickup point";

      if (error instanceof AxiosError && error.response?.data.error.message) {
        message = error.response.data.error.message;
      }
      toast.error(message);
    },
  });

  async function onSubmit(values: z.infer<typeof editPickupPointSchema>) {
    await mutateAsync({
      name: values.name,
      destinationId: values.destinationId,
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <h6 className="font-cal-sans text-2xl font-semibold">
            Edit Pickup Point
          </h6>
        </DialogHeader>
        <PickupPointForm
          schema={editPickupPointSchema}
          pickupPoint={pickupPoint}
          isPending={isPending}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
