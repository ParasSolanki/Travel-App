import { useNavigate } from "@tanstack/react-router";
import { createPickupPointSchema } from "@travel-app/api/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { z } from "zod";
import { PickupPointForm } from "~/components/pickup-point/pickup-point-form";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "~/components/ui/dialog";
import { api } from "~/utils/api";

export function AddPickupPointDialog() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["add-pickup-point"],
    mutationFn: api.createPickupPoint,
    onSuccess() {
      toast.success("Pickup point created successfully");
      queryClient.invalidateQueries({
        queryKey: ["pickup-points", { page: 0, perPage: 10 }],
      });
      setOpen(false);
      navigate({
        to: "/pickup-points",
        search: {
          page: 0,
        },
      });
    },
    onError(error) {
      let message = "Something went wrong while creating destination";

      if (error instanceof AxiosError && error.response?.data.error.message) {
        message = error.response.data.error.message;
      }
      toast.error(message);
    },
  });

  async function onSubmit(values: z.infer<typeof createPickupPointSchema>) {
    await mutateAsync({
      name: values.name,
      destinationId: values.destinationId,
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="text-white">
          <PlusIcon className="mr-1 h-4 w-4" /> Add Pickup Point
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <h6 className="font-cal-sans text-2xl font-semibold">
            Add Pickup Point
          </h6>
        </DialogHeader>
        <PickupPointForm
          schema={createPickupPointSchema}
          isPending={isPending}
          onSubmit={onSubmit}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
