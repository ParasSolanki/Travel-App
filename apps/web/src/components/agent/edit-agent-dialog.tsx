import { useMutation } from "@tanstack/react-query";
import { editAgentSchema } from "@travel-app/api/schema";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { z } from "zod";
import { AgentColumn } from "~/types";
import { api } from "~/utils/api";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import { AgentForm } from "./agent-form";

export default function EditAgentDialog({
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
  const { mutate, isPending } = useMutation({
    mutationKey: ["update-agent", agent.id],
    mutationFn: (values: z.infer<typeof editAgentSchema>) =>
      api.updateAgent(values, { params: { id: agent.id } }),
    onSuccess() {
      toast.success("Agent updated successfully");
    },
    onError(error) {
      let message = "Something went wrong while updating Agent";

      if (error instanceof AxiosError && error.response?.data.error.message) {
        message = error.response.data.error.message;
      }
      toast.error(message);
    },
  });

  function onSubmit(values: z.infer<typeof editAgentSchema>) {
    mutate(
      {
        name: values.name,
        email: values.email,
        address: values.address,
        phoneNumber: values.phoneNumber,
      },
      {
        onSuccess() {
          onOpenChange(false);
          onSuccess?.();
        },
      },
    );
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
          isPending={isPending}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
