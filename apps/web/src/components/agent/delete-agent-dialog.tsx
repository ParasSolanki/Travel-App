import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
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
import { api } from "~/utils/api";
import { Button } from "~/components/ui/button";

export default function DeleteAgentDialog({
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
  const { mutate, isPending } = useMutation({
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
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              className="bg-red-500 text-white hover:bg-red-600 focus:bg-red-600"
              disabled={isPending}
              onClick={() => mutate()}
            >
              Continue
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
