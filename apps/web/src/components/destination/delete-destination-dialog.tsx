import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "react-hot-toast";
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
import { Button } from "../ui/button";

export default function DeleteDestinationDialog({
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
  const { mutateAsync, isLoading } = useMutation({
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
