import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  createDestinationSchema,
  editDestinationSchema,
} from "@travel-app/api/schema";
import { AxiosError } from "axios";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { z } from "zod";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { Destination } from "~/types";
import { api } from "~/utils/api";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog";
import { DestinationForm } from "./destination-form";

export function AddDestinationDialog() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["add-destination"],
    mutationFn: api.createDestination,
    onSuccess() {
      setOpen(false);
      toast.success("Destination created successfully");
      queryClient.invalidateQueries({
        queryKey: ["destinations", { page: 0 }],
      });
      navigate({
        to: "/destinations",
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

  async function onSubmit(values: z.infer<typeof createDestinationSchema>) {
    await mutateAsync({
      name: values.name,
      shortCode: values.shortCode,
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="text-white">
          <PlusIcon className="mr-1 h-4 w-4" /> Add Destination
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <h6 className="font-cal-sans text-2xl font-semibold">
            Add Destination
          </h6>
        </DialogHeader>
        <DestinationForm
          schema={createDestinationSchema}
          isPending={isPending}
          onSubmit={onSubmit}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

export function EditDestinationDialog({
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
  const { mutateAsync, isPending } = useMutation({
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
          isPending={isPending}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

export function DeleteDestinationDialog({
  open,
  destinationId,
  onOpenChange,
  onSuccess,
}: {
  open: boolean;
  destinationId: string;
  onOpenChange: (v: boolean) => void;
  onSuccess?: () => void;
}) {
  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["delete-destination", destinationId],
    mutationFn: () =>
      api.deleteDestination(undefined, { params: { id: destinationId } }),
    onSuccess() {
      onOpenChange(false);
      toast.success("Destination deleted successfully");
      onSuccess?.();
    },
    onError(error) {
      let message = "Something went wrong while deleting destination";

      if (error instanceof AxiosError && error.response?.data.error.message) {
        message = error.response.data.error.message;
      }
      toast.error(message);
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="font-cal-sans">
            Are you sure?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will delete destination.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              className="bg-red-500 text-white hover:bg-red-600 focus:bg-red-600"
              disabled={isPending}
              onClick={async () => await mutateAsync()}
            >
              Continue
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
