import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { createAgentSchema } from "@travel-app/api/schema";
import { AxiosError } from "axios";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { z } from "zod";
import { agentQueries } from "~/common/queries";
import { AgentForm } from "~/components/agent/agent-form";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "~/components/ui/dialog";
import { api } from "~/utils/api";

export default function AddAgentDialog() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useMutation({
    mutationKey: ["add-agent"],
    mutationFn: api.createAgent,
    onSuccess() {
      toast.success("Agent point created successfully");
      queryClient.invalidateQueries(
        agentQueries.list({ page: 0, perPage: 10 }),
      );
    },
    onError(error) {
      let message = "Something went wrong while creating agent";

      if (error instanceof AxiosError && error.response?.data.error.message) {
        message = error.response.data.error.message;
      }
      toast.error(message);
    },
  });

  function onSubmit(values: z.infer<typeof createAgentSchema>) {
    mutate(
      {
        name: values.name,
        email: values.email,
        address: values.address,
        phoneNumber: values.phoneNumber,
      },
      {
        onSuccess() {
          setOpen(false);
          navigate({
            to: "/agents",
            search: {
              page: 0,
            },
          });
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="text-white">
          <PlusIcon className="mr-1 h-4 w-4" /> Add Agent
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <h2 className="font-cal-sans text-2xl font-semibold">Add Agent</h2>
        </DialogHeader>
        <AgentForm
          schema={createAgentSchema}
          isPending={isPending}
          onSubmit={onSubmit}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
