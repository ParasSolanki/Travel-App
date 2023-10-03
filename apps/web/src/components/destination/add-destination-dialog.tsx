import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { createDestinationSchema } from "@travel-app/api/schema";
import { AxiosError } from "axios";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { z } from "zod";
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
  const [open, setOpen] = useState(false);
  const { mutateAsync, isLoading } = useMutation({
    mutationKey: ["add-destination"],
    mutationFn: api.createDestination,
    onSuccess() {
      setOpen(false);
      toast.success("Destination created successfully");

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
          isLoading={isLoading}
          onSubmit={onSubmit}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
