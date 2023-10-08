import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { createAgentSchema, editAgentSchema } from "@travel-app/api/schema";
import { AxiosError } from "axios";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { z } from "zod";
import { AgentForm } from "~/components/agent/agent-form";
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
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "~/components/ui/dialog";
import { AgentColumn } from "~/types";
import { api } from "~/utils/api";

export function AddAgentDialog() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const { mutateAsync, isLoading } = useMutation({
    mutationKey: ["add-agent"],
    mutationFn: api.createAgent,
    onSuccess() {
      toast.success("Agent point created successfully");
      queryClient.invalidateQueries({
        queryKey: ["agents", { page: 0, perPage: 10 }],
      });
      setOpen(false);
      navigate({
        to: "/agents",
        search: {
          page: 0,
        },
      });
    },
    onError(error) {
      let message = "Something went wrong while creating agent";

      if (error instanceof AxiosError && error.response?.data.error.message) {
        message = error.response.data.error.message;
      }
      toast.error(message);
    },
  });

  async function onSubmit(values: z.infer<typeof createAgentSchema>) {
    await mutateAsync({
      name: values.name,
      email: values.email,
      address: values.address,
      phoneNumber: values.phoneNumber,
    });
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
          isLoading={isLoading}
          onSubmit={onSubmit}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

export function EditAgentDialog({
  open,
  agent,
  onOpenChange,
  onSuccess,
}: {
  open: boolean;
  agent: AgentColumn;
  onOpenChange: (v: boolean) => void;
  onSuccess?: () => void;
}) {
  const { mutateAsync, isLoading } = useMutation({
    mutationKey: ["update-agent", agent.id],
    mutationFn: (values: z.infer<typeof editAgentSchema>) =>
      api.updateAgent(values, { params: { id: agent.id } }),
    onSuccess() {
      toast.success("Agent updated successfully");

      onOpenChange(false);
      onSuccess?.();
    },
    onError(error) {
      let message = "Something went wrong while updating Agent";

      if (error instanceof AxiosError && error.response?.data.error.message) {
        message = error.response.data.error.message;
      }
      toast.error(message);
    },
  });

  async function onSubmit(values: z.infer<typeof editAgentSchema>) {
    await mutateAsync({
      name: values.name,
      email: values.email,
      address: values.address,
      phoneNumber: values.phoneNumber,
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <h6 className="font-cal-sans text-2xl font-semibold">Edit Agent</h6>
        </DialogHeader>
        <AgentForm
          schema={editAgentSchema}
          agent={agent}
          isLoading={isLoading}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

export function DeleteAgentDialog({
  open,
  agentId,
  onOpenChange,
  onSuccess,
}: {
  open: boolean;
  agentId: string;
  onOpenChange: (v: boolean) => void;
  onSuccess?: () => void;
}) {
  const { mutateAsync, isLoading } = useMutation({
    mutationKey: ["delete-agent", agentId],
    mutationFn: () => api.deleteAgent(undefined, { params: { id: agentId } }),
    onSuccess() {
      toast.success("Agent deleted successfully");

      onOpenChange(false);
      onSuccess?.();
    },
    onError(error) {
      let message = "Something went wrong while deleting agent";

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
            This action cannot be undone. This will delete agent.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              className="bg-red-500 text-white hover:bg-red-600 focus:bg-red-600"
              disabled={isLoading}
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
